import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

interface RawOrderItem {
  name?: string;
  quantity?: number;
}

interface RawOrderDoc {
  _id: unknown;
  orderStatus?: string;
  trackingNumber?: string;
  courier?: string;
  shippingAddress?: {
    fullName?: string;
    phoneNumber?: string;
    streetAddress?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  items?: RawOrderItem[];
  totalAmount?: number;
  paymentMethod?: string;
  updatedAt?: string | Date;
  createdAt?: string | Date;
}

export async function GET(_req: NextRequest) {
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;

    let orders: RawOrderDoc[] = [];

    if (db) {
      const ordersColl = db.collection('orders');
      orders = (await ordersColl
        .find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray()) as unknown as RawOrderDoc[];
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const parcels = orders.map((o) => {
      const status = (o.orderStatus || 'pending').toLowerCase();
      let currentStage = 1;
      let statusText = 'Order Placed';

      if (status === 'confirmed') {
        currentStage = 2;
        statusText = 'Confirmed';
      } else if (status === 'processing' || status === 'packaging') {
        currentStage = 3;
        statusText = 'Packaging & QC';
      } else if (status === 'shipped') {
        currentStage = 4;
        statusText = 'In Transit';
      } else if (status === 'delivered') {
        currentStage = 5;
        statusText = 'Delivered';
      } else if (status === 'cancelled') {
        currentStage = 0;
        statusText = 'Cancelled';
      }

      const trk = o.trackingNumber || `NX-${String(o._id).slice(-6).toUpperCase()}`;
      const formattedOrderId = trk.startsWith('NX-') ? trk : `NX-${trk.replace(/^NEX-/, '')}`;
      const city = o.shippingAddress?.city || 'Dhaka';
      const address = o.shippingAddress?.streetAddress || o.shippingAddress?.address || city;

      return {
        id: String(o._id),
        orderId: formattedOrderId,
        trackingNumber: trk,
        courier: o.courier || (city.toLowerCase() === 'dhaka' ? 'Pathao Courier' : 'Steadfast'),
        recipient: {
          name: o.shippingAddress?.fullName || 'Valued Customer',
          phone: o.shippingAddress?.phoneNumber || '+880 1700-000000',
          address: address.includes(city) ? address : `${address}, ${city}`,
          city,
        },
        items: (o.items || []).map((i) => ({ name: i.name || 'Product Item', quantity: i.quantity || 1 })),
        amount: o.totalAmount || 0,
        paymentType: o.paymentMethod === 'cash_on_delivery' ? 'COD' : 'PREPAID',
        currentStage,
        statusText,
        lastUpdated: o.updatedAt
          ? new Date(o.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'Today',
        hub: 'Tejgaon Central Sorting Hub',
      };
    });

    return NextResponse.json({
      success: true,
      count: parcels.length,
      data: parcels,
    });
  } catch (error: unknown) {
    console.error('API Admin Tracking Parcels GET error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error',
    }, { status: 500 });
  }
}
