import { VisitorSession, TimeFilter, KpiFilterType } from '@/store/useVisitorAnalyticsStore';

export function exportToBrandedExcel(
  sessions: VisitorSession[],
  timeFilter: TimeFilter,
  kpiFilter: KpiFilterType,
  liveCount: number
) {
  const generatedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const totalCartValue = sessions
    .filter((s) => s.isCartActive && s.cartValueBDT)
    .reduce((acc, curr) => acc + (curr.cartValueBDT || 0), 0);

  const filterTitle =
    kpiFilter === 'cart'
      ? 'Active Cart & Abandoned Lead Recovery Sheet'
      : kpiFilter === 'bounced'
      ? 'Bounced Visitors & Exit Analysis'
      : kpiFilter === 'live'
      ? 'Live Real-Time Active Sessions'
      : 'Comprehensive Visitor & Traffic Telemetry Report';

  // Build high-styled HTML/XML Spreadsheet compatible with Microsoft Excel, Google Sheets, Apple Number
  const htmlContent = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #1e293b; }
    .header-banner { background-color: #ff4400; color: #ffffff; font-size: 18pt; font-weight: bold; text-align: center; padding: 16px; }
    .sub-banner { background-color: #ff6600; color: #ffffff; font-size: 12pt; font-weight: bold; text-align: center; padding: 8px; }
    table { border-collapse: collapse; width: 100%; }
    th { background-color: #ff4400; color: #ffffff; font-weight: bold; border: 1px solid #e2e8f0; padding: 10px 8px; text-align: left; }
    td { border: 1px solid #e2e8f0; padding: 8px; vertical-align: middle; }
    tr:nth-child(even) { background-color: #f8fafc; }
    .badge-cart { background-color: #ffedd5; color: #c2410c; font-weight: bold; padding: 3px 8px; border-radius: 4px; }
    .badge-active { background-color: #dcfce7; color: #15803d; font-weight: bold; padding: 3px 8px; border-radius: 4px; }
    .badge-bounced { background-color: #f3e8ff; color: #7e22ce; font-weight: bold; padding: 3px 8px; border-radius: 4px; }
    .badge-blocked { background-color: #ffe4e6; color: #be123c; font-weight: bold; padding: 3px 8px; border-radius: 4px; }
    .currency { color: #ea580c; font-weight: bold; font-family: monospace; }
    .phone { font-weight: bold; color: #2563eb; font-family: monospace; }
    .anon-phone { color: #94a3b8; font-style: italic; }
    .total-row { background-color: #f1f5f9; font-weight: bold; }
  </style>
</head>
<body>
  <table>
    <tr>
      <td colspan="13" class="header-banner">SHOPNEXUS OFFICIAL™ — EXECUTIVE TELEMETRY & TELESALES REPORT</td>
    </tr>
    <tr>
      <td colspan="13" class="sub-banner">${filterTitle.toUpperCase()} • Generated: ${generatedAt} (${timeFilter.toUpperCase()})</td>
    </tr>
    <tr><td colspan="13"></td></tr>
    <thead>
      <tr>
        <th style="width: 40px;">#</th>
        <th style="width: 180px;">Customer / Lead Name</th>
        <th style="width: 160px;">Contact Phone</th>
        <th style="width: 130px;">IP Address</th>
        <th style="width: 150px;">Location</th>
        <th style="width: 190px;">Device & Exact Model</th>
        <th style="width: 140px;">Network (ISP)</th>
        <th style="width: 130px;">Current URL</th>
        <th style="width: 140px;">Acquisition Source</th>
        <th style="width: 220px;">Cart Summary & Products</th>
        <th style="width: 130px;">Cart Value (৳)</th>
        <th style="width: 100px;">Status</th>
        <th style="width: 150px;">Telesales Action</th>
      </tr>
    </thead>
    <tbody>
      ${sessions
        .map((s, idx) => {
          const leadName = s.customerName || `Shopper #${s.id.replace('sess_', '')}`;
          const phoneCell = s.contactPhone
            ? `<span class="phone">${s.contactPhone}</span>`
            : `<span class="anon-phone">— (Anonymous Guest)</span>`;
          const cartSummary = s.cartItemsSummary || (s.isBounced ? s.bounceReason || 'Bounced visit' : 'Browsing catalog');
          const cartValStr = s.cartValueBDT ? `৳ ${s.cartValueBDT.toLocaleString()}` : '-';
          const statusClass = s.status === 'blocked' ? 'badge-blocked' : s.isCartActive ? 'badge-cart' : s.isBounced ? 'badge-bounced' : 'badge-active';
          const statusLabel = s.status === 'blocked' ? 'Blocked IP' : s.isCartActive ? 'Cart Active' : s.isBounced ? 'Bounced' : 'Active';
          const callAction = s.contactPhone
            ? (s.isCartActive ? '📞 Call Customer' : '📞 Follow-up Lead')
            : (s.isCartActive ? '🌐 Retargeting Ad' : '—');

          return `
          <tr>
            <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
            <td style="font-weight: bold;">${leadName}</td>
            <td>${phoneCell}</td>
            <td style="font-family: monospace;">${s.ip}</td>
            <td>${s.flag} ${s.city}, ${s.country}</td>
            <td><strong>${s.deviceModel}</strong> (${s.os})</td>
            <td>${s.isp}</td>
            <td style="color: #ea580c; font-family: monospace;">${s.currentUrl}</td>
            <td>${s.referrer}</td>
            <td>${cartSummary}</td>
            <td class="currency" style="text-align: right;">${cartValStr}</td>
            <td style="text-align: center;"><span class="${statusClass}">${statusLabel}</span></td>
            <td style="font-weight: bold; color: #0284c7;">${callAction}</td>
          </tr>`;
        })
        .join('')}
    </tbody>
    <tfoot>
      <tr class="total-row">
        <td colspan="10" style="text-align: right; font-weight: bold; font-size: 11pt; padding: 10px;">
          মোট কার্ট মূল্য (Total Cart Value in Report):
        </td>
        <td class="currency" style="text-align: right; font-size: 12pt; font-weight: bold; color: #ea580c; padding: 10px;">
          ৳ ${totalCartValue.toLocaleString()} BDT
        </td>
        <td colspan="2" style="font-size: 10pt; color: #475569; padding: 10px;">
          ${sessions.length} Leads Total
        </td>
      </tr>
    </tfoot>
  </table>
  <br />
  <p style="font-size: 9pt; color: #64748b; text-align: center;">
    Confidential Telemetry Report • ShopNexus E-Commerce Operations • Generated for Super Admin S.M. Amirul Islam
  </p>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ShopNexus_Report_${kpiFilter}_${timeFilter}_${Date.now()}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printBrandedPDF(
  sessions: VisitorSession[],
  timeFilter: TimeFilter,
  kpiFilter: KpiFilterType,
  liveCount: number
) {
  const generatedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const totalCartValue = sessions
    .filter((s) => s.isCartActive && s.cartValueBDT)
    .reduce((acc, curr) => acc + (curr.cartValueBDT || 0), 0);

  const filterTitle =
    kpiFilter === 'cart'
      ? 'Active Cart & Abandoned Lead Recovery Sheet'
      : kpiFilter === 'bounced'
      ? 'Bounced Visitors & Exit Analysis'
      : kpiFilter === 'live'
      ? 'Live Real-Time Active Sessions'
      : 'Comprehensive Visitor & Traffic Telemetry Report';

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>ShopNexus - ${filterTitle}</title>
  <style>
    @page { size: A4 landscape; margin: 12mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; margin: 0; padding: 20px; background: #fff; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #ff4400; padding-bottom: 12px; margin-bottom: 16px; }
    .brand-title { font-size: 24px; font-weight: 900; color: #ff4400; letter-spacing: -0.5px; margin: 0; }
    .brand-sub { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 1px; }
    .report-title { font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 10px; margin-top: 8px; }
    th { background: #0f172a; color: #fff; text-align: left; padding: 7px 8px; font-weight: 700; text-transform: uppercase; font-size: 8px; }
    td { padding: 7px 8px; border-bottom: 1px solid #e2e8f0; }
    tr:nth-child(even) { background: #f8fafc; }
    .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 8px; font-weight: 800; }
    .badge-cart { background: #ffedd5; color: #c2410c; }
    .badge-active { background: #dcfce7; color: #15803d; }
    .badge-bounced { background: #f3e8ff; color: #7e22ce; }
    .badge-blocked { background: #ffe4e6; color: #be123c; }
    .phone { font-family: monospace; font-weight: 700; color: #2563eb; font-size: 9px; }
    .anon-phone { color: #94a3b8; font-style: italic; font-size: 8.5px; }
    .currency { font-family: monospace; font-weight: 800; color: #ea580c; }
    .watermark { position: fixed; top: 40%; left: 30%; font-size: 80px; color: rgba(255, 68, 0, 0.04); font-weight: 900; transform: rotate(-30deg); pointer-events: none; z-index: 0; }
    .footer { text-align: center; font-size: 9px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 8px; }
    tfoot td { background: #f1f5f9; font-weight: 800; border-top: 2px solid #cbd5e1; border-bottom: 2px solid #cbd5e1; }
  </style>
</head>
<body>
  <div class="watermark">SHOPNEXUS</div>
  <div class="header">
    <div>
      <h1 class="brand-title">ShopNexus Official</h1>
      <div class="brand-sub">Enterprise E-Commerce Intelligence</div>
      <div class="report-title">${filterTitle}</div>
    </div>
    <div style="text-align: right; font-size: 10px; color: #64748b;">
      <div><strong>Date:</strong> ${generatedAt}</div>
      <div><strong>Scope:</strong> ${timeFilter.toUpperCase()} • ${sessions.length} Shopper Records</div>
      <div><strong>Generated By:</strong> Super Admin (Root)</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 30px;">#</th>
        <th style="width: 140px;">Customer / Lead Name</th>
        <th style="width: 120px;">Contact Phone</th>
        <th style="width: 130px;">IP & Location</th>
        <th style="width: 150px;">Device & Model</th>
        <th style="width: 110px;">Current Page</th>
        <th style="width: 180px;">Cart Summary</th>
        <th style="width: 100px; text-align: right;">Cart Value</th>
        <th style="width: 80px; text-align: center;">Status</th>
        <th style="width: 100px;">Telesales Action</th>
      </tr>
    </thead>
    <tbody>
      ${sessions
        .map((s, idx) => {
          const leadName = s.customerName || `Shopper #${s.id.replace('sess_', '')}`;
          const phoneCell = s.contactPhone
            ? `<span class="phone">${s.contactPhone}</span>`
            : `<span class="anon-phone">— (Anonymous Guest)</span>`;
          const cartSummary = s.cartItemsSummary || (s.isBounced ? s.bounceReason || 'Bounced visit' : 'Browsing catalog');
          const cartValStr = s.cartValueBDT ? `৳ ${s.cartValueBDT.toLocaleString()}` : '-';
          const statusClass = s.status === 'blocked' ? 'badge-blocked' : s.isCartActive ? 'badge-cart' : s.isBounced ? 'badge-bounced' : 'badge-active';
          const statusLabel = s.status === 'blocked' ? 'Blocked' : s.isCartActive ? 'Cart Active' : s.isBounced ? 'Bounced' : 'Active';
          const callAction = s.contactPhone
            ? (s.isCartActive ? '📞 Call Customer' : '📞 Follow-up')
            : (s.isCartActive ? '🌐 Retargeting Ad' : '—');

          return `
          <tr>
            <td style="text-align: center;"><strong>${idx + 1}</strong></td>
            <td><strong>${leadName}</strong></td>
            <td>${phoneCell}</td>
            <td>${s.flag} ${s.city}<br><span style="font-family: monospace; color: #64748b; font-size: 8px;">${s.ip}</span></td>
            <td><strong>${s.deviceModel}</strong><br><span style="color: #64748b; font-size: 8px;">${s.os}</span></td>
            <td style="color: #ea580c; font-family: monospace;">${s.currentUrl}</td>
            <td>${cartSummary}</td>
            <td class="currency" style="text-align: right;">${cartValStr}</td>
            <td style="text-align: center;"><span class="badge ${statusClass}">${statusLabel}</span></td>
            <td style="font-weight: 700; color: #0284c7;">${callAction}</td>
          </tr>`;
        })
        .join('')}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="7" style="text-align: right; font-size: 10px; padding: 8px 10px;">
          মোট কার্ট মূল্য (Total Cart Value in Report):
        </td>
        <td class="currency" style="font-size: 11px; text-align: right; padding: 8px 10px;">
          ৳ ${totalCartValue.toLocaleString()} BDT
        </td>
        <td colspan="2" style="font-size: 9px; color: #64748b; padding: 8px 10px;">
          ${sessions.length} Records
        </td>
      </tr>
    </tfoot>
  </table>

  <div class="footer">
    ShopNexus E-Commerce Platform • Authorized Administrator Copy • ${generatedAt}
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
}
