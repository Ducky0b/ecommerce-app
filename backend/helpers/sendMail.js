const nodemailer = require("nodemailer");

const sendOrderEmail = async (user, order, productOrders) => {
  console.log("🚀 sendOrderEmail() START");
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const productListHTML = productOrders
      .map(
        (item, index) => `
        <tr style="text-align:center;">
          <td style="padding:8px; border-bottom:1px solid #eee;">${
            index + 1
          }</td>
          <td style="padding:8px; border-bottom:1px solid #eee;">${
            item.productId?.name || "Sản phẩm"
          }</td>
          <td style="padding:8px; border-bottom:1px solid #eee;">${
            item.color || "-"
          }</td>
          <td style="padding:8px; border-bottom:1px solid #eee;">${
            item.size || "-"
          }</td>
          <td style="padding:8px; border-bottom:1px solid #eee;">${
            item.quantity
          }</td>
          <td style="padding:8px; border-bottom:1px solid #eee;">${Number(
            item.price
          ).toLocaleString()}₫</td>
        </tr>`
      )
      .join("");

    const formatVND = (num) => (Number(num) || 0).toLocaleString("vi-VN") + "₫";

    const shippingFee = order.totalAmount < 500000 ? 30000 : 0;
    const finalTotal = order.totalAmount + shippingFee;

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color:#000;">Xin chào ${user.name || user.email},</h2>
      <p>Cảm ơn bạn đã đặt hàng tại <b>VFashion Store</b>! Dưới đây là chi tiết đơn hàng của bạn:</p>

      <h3>📦 Mã đơn hàng: <span style="color:#007bff;">#${order._id}</span></h3>

      <table style="width:100%; border-collapse:collapse; margin-top:10px;">
        <thead style="background:#f5f5f5;">
          <tr style="text-align:center;">
            <th style="padding:8px;">#</th>
            <th style="padding:8px;">Sản phẩm</th>
            <th style="padding:8px;">Màu</th>
            <th style="padding:8px;">Size</th>
            <th style="padding:8px;">SL</th>
            <th style="padding:8px;">Giá</th>
          </tr>
        </thead>
        <tbody>
          ${productListHTML}
        </tbody>
      </table>

      <div style="margin-top:20px; border-top:1px solid #ddd; padding-top:10px;">
        <p><b>Tạm tính:</b> ${formatVND(order.totalAmount)}</p>
        <p><b>Phí vận chuyển:</b> ${
          shippingFee > 0
            ? formatVND(shippingFee)
            : "<span style='color:green;'>Miễn phí</span>"
        }</p>
        <h3 style="margin-top:10px;">💰 <b>Tổng thanh toán: ${formatVND(
          finalTotal
        )}</b></h3>
      </div>

      <p style="margin-top:20px;">⏰ Chúng tôi sẽ liên hệ với bạn sớm để xác nhận giao hàng.</p>
      <p>Xin cảm ơn,<br><b>VFashion Store</b></p>
      <hr style="border:none; border-top:1px solid #eee; margin-top:20px;">
      <p style="font-size:12px; color:#999;">Đây là email tự động, vui lòng không trả lời lại email này.</p>
    </div>
    `;
    console.log("📨 Đang gửi mail tới:", user.email);
    await transporter.sendMail({
      from: `"VFashion Store" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: `Xác nhận đơn hàng #${order._id} - VFashion Store`,
      html: htmlContent,
    });
    console.log("✅ Email đã gửi thành công tới:", user.email);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendOrderEmail };
