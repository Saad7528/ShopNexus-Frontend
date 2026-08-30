export interface IOrderVolumeLedger {
  orderId: string;
  customerName: string;
  itemsCount: number;
  totalBDT: number;
  shippingZone: 'Inside Dhaka' | 'Outside Dhaka';
  status: 'PENDING' | 'CONFIRMED' | 'DISPATCHED' | 'DELIVERED';
}
