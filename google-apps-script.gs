/**
 * Nhận đơn hàng & đánh giá từ web Anela vào Google Sheets.
 * Cách cài: xem mục 4 trong HUONG-DAN.md
 */
function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (data.type === 'review') {
    var rs = ss.getSheetByName('DanhGia') || ss.insertSheet('DanhGia');
    if (rs.getLastRow() === 0) rs.appendRow(['Ngày', 'Tên', 'Số sao', 'Mẫu bánh', 'Nội dung']);
    rs.appendRow([data.date, data.name, data.rating, data.product, data.text]);
  } else {
    var os = ss.getSheetByName('DonHang') || ss.insertSheet('DonHang');
    if (os.getLastRow() === 0) {
      os.appendRow(['Mã đơn', 'Thời gian đặt', 'Khách', 'SĐT', 'Hình thức', 'Địa chỉ', 'Ngày nhận', 'Khung giờ', 'Thanh toán', 'Bánh', 'Tạm tính', 'Ghi chú', 'Trạng thái']);
    }
    var items = (data.items || []).map(function (i) {
      return i.name + ' (' + i.size + ') x' + i.qty + (i.note ? ' – chữ: ' + i.note : '');
    }).join('\n');
    os.appendRow([
      data.code, new Date(data.createdAt), data.name, "'" + data.phone,
      data.method === 'ship' ? 'Giao tận nơi' : 'Nhận tại tiệm', data.address,
      data.date, data.slot, data.payment === 'bank' ? 'Chuyển khoản' : 'Tiền mặt',
      items, data.total, data.notes, data.status
    ]);
  }
  return ContentService.createTextOutput('ok');
}
