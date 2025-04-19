# H-Perfume

Dự án thương mại điện tử nước hoa được xây dựng với kiến trúc hiện đại, kết hợp **Payload CMS**, **Next.js**

## ✨ Tính năng chính

- Quản lý sản phẩm, danh mục, đơn hàng, người dùng qua Payload CMS
- Tìm kiếm sản phẩm nhanh chóng
- Xử lý dữ liệu, logic phía server bằng payload cms
- Frontend React hiện đại với Next.js 15, TailwindCSS 4
- Chat realtime qua Socket.io

- **Database**: mongodb

```bash
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=mongo -e MONGO_INITDB_ROOT_PASSWORD=mongopw mongo
```

- **ConnectionString**: mongodb://mongo:mongopw@localhost:27017/multitenant-ecommerce?authSource=admin

---

## ⚙️ Công nghệ sử dụng

- **Next.js 15 + React 19**
- **TailwindCSS 4**
- **Payload CMS** (MongoDB backend)
- **Mongodb**: CSDL chính
- **Zustand + React Hook Form + Zod**
- **Radix UI + class-variance-authority + shadcn/ui**
- **Socket.io, Crisp chat**

---

## 📦 Cài đặt

> Đảm bảo bạn đã cài:
>
> - `Node.js >=20.9.0` hoặc `18.20.2`
> - `pnpm >=10`

```bash
# Clone dự án
git clone https://github.com/duynguyenbui/h-perfume.git
cd h-perfume

# Cài đặt các dependencies
pnpm install
```
