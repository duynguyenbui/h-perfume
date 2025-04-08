# H-Perfume

Dự án thương mại điện tử nước hoa được xây dựng với kiến trúc hiện đại, kết hợp **Payload CMS**, **NestJS**, **Next.js**, **PostgreSQL**, **Redis**, và **Elasticsearch**.

## ✨ Tính năng chính

- Quản lý sản phẩm, danh mục, đơn hàng, người dùng qua Payload CMS
- Tìm kiếm sản phẩm nhanh chóng với Elasticsearch
- Xử lý dữ liệu, logic phía server bằng NestJS + GraphQL
- Frontend React hiện đại với Next.js 15, TailwindCSS 4
- Tích hợp Redis để tối ưu hiệu năng (cache / session)
- Chat realtime qua Socket.io


---

## ⚙️ Công nghệ sử dụng

- **Next.js 15 + React 19**
- **TailwindCSS 4**
- **Payload CMS** (MongoDB / PostgreSQL backend)
- **NestJS + GraphQL (Apollo Driver)**
- **PostgreSQL**: CSDL chính
- **Redis**: cache & memory store
- **Elasticsearch**: tìm kiếm sản phẩm
- **Zustand + React Hook Form + Zod**
- **Radix UI + class-variance-authority + shadcn/ui**
- **Socket.io, Crisp chat**

---

## 📦 Cài đặt

> Đảm bảo bạn đã cài:
> - `Node.js >=20.9.0` hoặc `18.20.2`
> - `pnpm >=10`
> - PostgreSQL, Redis, Elasticsearch đã chạy local

```bash
# Clone dự án
git clone https://github.com/your-username/h-perfume.git
cd h-perfume

# Cài đặt các dependencies
pnpm install
