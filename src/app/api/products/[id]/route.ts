import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import { getProductByIdOrSlug } from '@/data/products';
import { INITIAL_BUNDLES } from '@/data/bundles';
import { convertBundleToProduct } from '@/store/useBundleStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Product ID required' }, { status: 400 });
    }

    const decoded = decodeURIComponent(id).trim();

    // 1. Try MongoDB Atlas collection
    await connectToDatabase();
    const db = mongoose.connection.db;

    if (db) {
      const productsColl = db.collection('products');
      const queryList: Record<string, unknown>[] = [
        { _id: decoded },
        { id: decoded },
        { slug: decoded },
        { slug: decoded.toLowerCase() },
      ];

      // If valid 24-char ObjectId
      if (/^[0-9a-fA-F]{24}$/.test(decoded)) {
        try {
          queryList.push({ _id: new mongoose.Types.ObjectId(decoded) });
        } catch {
          // ignore object id parse error
        }
      }

      const product = await productsColl.findOne({ $or: queryList });

      if (product) {
        return NextResponse.json({ success: true, data: { product } });
      }
    }

    // 2. Check Static Products Catalog
    const staticProduct = getProductByIdOrSlug(decoded);
    if (staticProduct) {
      return NextResponse.json({ success: true, data: { product: staticProduct } });
    }

    // 3. Check Bundle Deals
    const bundle = INITIAL_BUNDLES.find(
      (b) =>
        b.id === decoded ||
        b.id === `b-${decoded}` ||
        b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === decoded.toLowerCase()
    );
    if (bundle) {
      const bundleProduct = convertBundleToProduct(bundle);
      return NextResponse.json({ success: true, data: { product: bundleProduct } });
    }

    return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
  } catch (error: unknown) {
    console.error('API Product GET by ID error:', error);
    const msg = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();
    const db = mongoose.connection.db;

    if (db) {
      const productsColl = db.collection('products');
      const queryList: Record<string, unknown>[] = [
        { _id: id },
        { id },
        { slug: id },
      ];
      if (/^[0-9a-fA-F]{24}$/.test(id)) {
        try {
          queryList.push({ _id: new mongoose.Types.ObjectId(id) });
        } catch {}
      }

      await productsColl.updateOne(
        { $or: queryList },
        { $set: { ...body, updatedAt: new Date() } },
        { upsert: true }
      );
    }

    return NextResponse.json({ success: true, message: 'Product updated successfully', data: body });
  } catch (error: unknown) {
    console.error('API Product PUT error:', error);
    const msg = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const db = mongoose.connection.db;

    if (db) {
      const productsColl = db.collection('products');
      const queryList: Record<string, unknown>[] = [
        { _id: id },
        { id },
        { slug: id },
      ];
      if (/^[0-9a-fA-F]{24}$/.test(id)) {
        try {
          queryList.push({ _id: new mongoose.Types.ObjectId(id) });
        } catch {}
      }

      await productsColl.deleteOne({
        $or: queryList,
      });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: unknown) {
    console.error('API Product DELETE error:', error);
    const msg = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
