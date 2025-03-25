'use client'
import React, { useState } from 'react'

export default function OrderPage() {
  // State để lưu trữ thông tin người dùng nhập
  const [address, setAddress] = useState('')
  const [coupon, setCoupon] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('COD') // Mặc định là COD

  // Giả lập dữ liệu tổng tiền
  const temporaryTotal = 1955500 // Tạm tính
  const tax = 0 // Thuế (10%)
  const discount = 0 // Giảm giá từ coupon
  const shippingFee = 37500 // Phí vận chuyển
  const total = temporaryTotal + shippingFee - discount

  // Hàm xử lý khi nhấn nút Thanh Toán
  const handlePayment = () => {
    if (!address) {
      alert('Vui lòng nhập địa chỉ giao hàng!')
      return
    }

    if (paymentMethod === 'COD') {
      alert('Đặt hàng thành công! Bạn đã chọn thanh toán COD.')
      // Gửi dữ liệu đơn hàng lên server (giả lập)
      console.log({
        address,
        coupon,
        paymentMethod,
        total,
      })
    } else if (paymentMethod === 'Momo') {
      alert('Chuyển hướng đến cổng thanh toán Momo...')
      // Logic tích hợp Momo (giả lập)
      // Trong thực tế, bạn sẽ cần gọi API của Momo để tạo link thanh toán
      console.log('Chuyển hướng đến Momo với số tiền:', total)
    }
  }

  return (
    <div className="order-page">
      {/* Thanh điều hướng */}
      <nav className="navbar">
        <div className="nav-links">
          <span>Trang Chủ</span>
          <span>Bộ Sưu Tập</span>
          <span>Nước Hoa</span>
          <span>Tài khoản</span>
          <span>Đơn hàng</span>
        </div>
        <div className="user-info">
          <span>User</span>
          <span>Đăng xuất</span>
        </div>
      </nav>

      <div className="order-container">
        {/* Phần nhập thông tin giao hàng */}
        <div className="order-section">
          <h3>Địa Chỉ Giao Hàng</h3>
          <select value={address} onChange={(e) => setAddress(e.target.value)}>
            <option value="">Chọn địa chỉ</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
          </select>
        </div>

        {/* Phần mã khuyến mãi */}
        <div className="order-section">
          <h3>Mã Khuyến Mãi</h3>
          <select value={coupon} onChange={(e) => setCoupon(e.target.value)}>
            <option value="">Chọn mã khuyến mãi</option>
            <option value="GIAM10">GIAM10</option>
            <option value="FREESHIP">FREESHIP</option>
          </select>
        </div>

        {/* Phần phương thức thanh toán */}
        <div className="order-section">
          <h3>Phương Thức Thanh Toán</h3>
          <div className="payment-methods">
            <label>
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              COD (Thanh Toán Khi Nhận Hàng): Thanh toán bằng tiền mặt khi nhận hàng
            </label>
            <label>
              <input
                type="radio"
                value="Momo"
                checked={paymentMethod === 'Momo'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Thanh Toán Online: Thanh toán qua Momo
            </label>
          </div>
        </div>

        {/* Phần tổng cộng */}
        <div className="order-summary">
          <h3>Tổng cộng</h3>
          <div className="summary-item">
            <span>Tạm tính</span>
            <span>{temporaryTotal.toLocaleString()} đ</span>
          </div>
          <div className="summary-item">
            <span>Thuế (10%)</span>
            <span>{tax.toLocaleString()} đ</span>
          </div>
          <div className="summary-item">
            <span>Giảm giá (Coupon)</span>
            <span>- {discount.toLocaleString()} đ</span>
          </div>
          <div className="summary-item">
            <span>Phí vận chuyển</span>
            <span>{shippingFee.toLocaleString()} đ</span>
          </div>
          <div className="summary-item total">
            <span>Tổng cộng</span>
            <span>{total.toLocaleString()} đ</span>
          </div>
        </div>

        {/* Nút Thanh Toán */}
        <button className="payment-button" onClick={handlePayment}>
          Thanh Toán
        </button>
      </div>
    </div>
  )
}
