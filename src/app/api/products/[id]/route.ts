import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import { ALL_PRODUCTS, getProductByIdOrSlug } from '@/data/products';
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
      const queryList: any[] = [
        { _id: decoded as any },
        { id: decoded },
        { slug: decoded },
        { slug: decoded.toLowerCase() },
      ];

      // If valid 24-char ObjectId
      if (/^[0-9a-fA-F]{24}$/.test(decoded)) {
        try {
          queryList.push({ _id: new mongoose.Types.ObjectId(decoded) });
        } catch (_e) {}
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
  } catch (error: any) {
    console.error('API Product GET by ID error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal error' }, { status: 500 });
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
      await productsColl.updateOne(
        { $or: [{ _id: id as any }, { id }, { slug: id }] },
        { $set: { ...body, updatedAt: new Date() } },
        { upsert: true }
      );
    }

    return NextResponse.json({ success: true, message: 'Product updated successfully', data: body });
  } catch (error: any) {
    console.error('API Product PUT error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const db = mongoose.connection.db;

    if (db) {
      const productsColl = db.collection('products');
      await productsColl.deleteOne({
        $or: [{ _id: id as any }, { id }, { slug: id }],
      });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('API Product DELETE error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal error' }, { status: 500 });
  }
}
