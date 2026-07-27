import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase/admin';
import { INITIAL_KEYS, ApiKeyRecord, getApiKeyRecords, setApiKeyRecords, updateApiKeyRecord, deleteApiKeyRecord } from '../../../../lib/api/loadBalancer';

export async function GET() {
  try {
    if (adminDb) {
      const db = adminDb;
      const snap = await db.collection('api_keys').get();
      if (!snap.empty) {
        const list = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as ApiKeyRecord));
        setApiKeyRecords(list);
        return NextResponse.json({ keys: list });
      } else {
        // Seed initial keys in firestore for persistence
        const batch = db.batch();
        INITIAL_KEYS.forEach((key) => {
          const ref = db.collection('api_keys').doc(key.id);
          batch.set(ref, key);
        });
        await batch.commit();
        setApiKeyRecords(INITIAL_KEYS);
        return NextResponse.json({ keys: INITIAL_KEYS });
      }
    }
  } catch (_e) {
    // Silent fallback to memory pool
  }

  return NextResponse.json({ keys: getApiKeyRecords() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newRecord: ApiKeyRecord = {
      id: body.id || `key_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      provider: body.provider || 'openweathermap',
      label: body.label || `${body.provider || 'API'} Key`,
      key: body.key || '',
      dailyLimit: Number(body.dailyLimit) || 1000,
      callsToday: 0,
      resetAt: new Date(Date.now() + 86400000).toISOString(),
      status: body.status || 'active',
      priority: Number(body.priority) || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (adminDb) {
        await adminDb.collection('api_keys').doc(newRecord.id).set(newRecord);
      }
    } catch (_e) {
      // Silent fallback
    }
    updateApiKeyRecord(newRecord);

    return NextResponse.json({ success: true, key: newRecord });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Key ID is required' }, { status: 400 });
    }

    const updatedRecord = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (adminDb) {
        await adminDb.collection('api_keys').doc(body.id).update(updatedRecord);
      }
    } catch (_e) {
      // Silent fallback
    }
    updateApiKeyRecord(updatedRecord as ApiKeyRecord);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Key ID parameter is required' }, { status: 400 });
    }

    try {
      if (adminDb) {
        await adminDb.collection('api_keys').doc(id).delete();
      }
    } catch (_e) {
      // Silent fallback
    }
    deleteApiKeyRecord(id);

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
