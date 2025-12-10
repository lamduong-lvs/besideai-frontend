# Fix Google OAuth Error - Step by Step Guide

## 🔴 Lỗi Hiện Tại

```
Access blocked: Authorization Error
Error 401: invalid_client
The OAuth client was not found.
```

## 🔍 Nguyên Nhân

Lỗi này xảy ra khi:
1. **Redirect URIs không khớp** - URIs trong Google Cloud Console không match với app URL
2. **Client ID không tồn tại** - OAuth client đã bị xóa hoặc không tồn tại
3. **Client Secret không đúng** - Secret không khớp với Google Cloud Console

## ✅ Cách Sửa (Step by Step)

### Bước 1: Truy Cập Google Cloud Console

1. **Mở Google Cloud Console:**
   - Go to: https://console.cloud.google.com/
   - Đăng nhập với account có quyền quản lý project

2. **Chọn Project:**
   - Project name: `besideai-login-frontend`
   - Project ID: `besideai-login-frontend`

### Bước 2: Kiểm Tra OAuth Client

1. **Vào Credentials:**
   - Click menu ☰ (hamburger menu) ở góc trên bên trái
   - Chọn **APIs & Services** → **Credentials**

2. **Tìm OAuth 2.0 Client:**
   - Tìm client có Client ID: `231692293394-5v3o1utvr68t42d6vhfc5nsn1tn8mc2o`
   - Nếu không thấy → Client đã bị xóa, cần tạo mới (xem Bước 4)

3. **Nếu tìm thấy, click vào để edit**

### Bước 3: Cấu Hình Redirect URIs (QUAN TRỌNG!)

**Authorized JavaScript origins:**
```
https://besideai.work
https://www.besideai.work
```

**Authorized redirect URIs:**
```
https://besideai.work/api/auth/callback/google
https://www.besideai.work/api/auth/callback/google
```

**Lưu ý:**
- ✅ Phải có `https://`
- ✅ Không có trailing slash (`/`)
- ✅ Phải match chính xác với URL của app
- ✅ NextAuth.js sử dụng `/api/auth/callback/google` (không phải `/callback`)

### Bước 4: Tạo OAuth Client Mới (Nếu Client Không Tồn Tại)

Nếu không tìm thấy client, tạo mới:

1. **Tạo OAuth Client:**
   - Trong trang Credentials, click **+ CREATE CREDENTIALS**
   - Chọn **OAuth client ID**

2. **Cấu hình:**
   - **Application type**: `Web application`
   - **Name**: `BesideAI Web Client`

3. **Authorized JavaScript origins:**
   - Click **+ ADD URI**
   - Thêm:
     ```
     https://besideai.work
     https://www.besideai.work
     ```

4. **Authorized redirect URIs:**
   - Click **+ ADD URI**
   - Thêm từng URI một:
     ```
     https://besideai.work/api/auth/callback/google
     https://www.besideai.work/api/auth/callback/google
     ```

5. **Lưu:**
   - Click **CREATE**
   - **Copy Client ID** (sẽ hiện ra)
   - **Copy Client Secret** (sẽ hiện ra, chỉ hiện 1 lần!)

### Bước 5: Update Vercel Environment Variables

Nếu bạn đã tạo client mới hoặc cần update:

```bash
cd Frontend

# Update Client ID (nếu có client mới)
echo "YOUR_CLIENT_ID_HERE" | vercel env add GOOGLE_CLIENT_ID production

# Update Client Secret (nếu có client mới)
echo "YOUR_CLIENT_SECRET_HERE" | vercel env add GOOGLE_CLIENT_SECRET production
```

**Hoặc qua Vercel Dashboard:**
1. Go to: https://vercel.com/lamduong-lvs-projects/besideai/settings/environment-variables
2. Edit `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET`
3. Save

### Bước 6: Redeploy

```bash
cd Frontend
vercel deploy --prod
```

### Bước 7: Test

1. **Wait 5-10 phút** (Google cần time để propagate changes)
2. **Clear browser cache** hoặc dùng **Incognito mode**
3. **Visit**: https://besideai.work/sign-in
4. **Click "Continue with Google"**
5. **Sign in** với `lam.env90@gmail.com`

## 🔧 Kiểm Tra Hiện Tại

### Thông Tin Đã Có:

- **Client ID**: `231692293394-5v3o1utvr68t42d6vhfc5nsn1tn8mc2o`
- **Client Secret**: `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`
- **Project**: `besideai-login-frontend`

### Redirect URIs Cần Có:

Theo thông tin bạn cung cấp trước đó, redirect URIs đã được cấu hình:
- `https://besideai.work/callback`
- `https://www.besideai.work/callback`
- `https://besideai.work/api/auth/callback/google`
- `https://www.besideai.work/api/auth/callback/google`

**⚠️ Vấn đề có thể là:**
- NextAuth.js sử dụng `/api/auth/callback/google` (đã có ✅)
- Nhưng có thể Google Cloud Console chưa được update
- Hoặc client đã bị xóa

## 🚨 Troubleshooting

### Nếu vẫn lỗi sau khi sửa:

1. **Kiểm tra lại Redirect URIs:**
   - Phải match chính xác 100%
   - Không có trailing slash
   - Phải có `https://`

2. **Kiểm tra Client ID:**
   - Verify trong Google Cloud Console
   - Verify trong Vercel env vars
   - Phải match nhau

3. **Kiểm tra Client Secret:**
   - Verify trong Google Cloud Console
   - Verify trong Vercel env vars
   - Phải match nhau

4. **Wait và Retry:**
   - Google cần 5-10 phút để propagate
   - Clear browser cache
   - Try incognito mode

5. **Check OAuth Consent Screen:**
   - Go to: **APIs & Services** → **OAuth consent screen**
   - Verify app is configured
   - Add test users if needed

## 📋 Checklist

- [ ] Truy cập Google Cloud Console
- [ ] Tìm OAuth client với ID: `231692293394-5v3o1utvr68t42d6vhfc5nsn1tn8mc2o`
- [ ] Verify redirect URIs có:
  - `https://besideai.work/api/auth/callback/google`
  - `https://www.besideai.work/api/auth/callback/google`
- [ ] Nếu client không tồn tại → Tạo mới
- [ ] Update Vercel env vars nếu cần
- [ ] Redeploy to production
- [ ] Wait 5-10 phút
- [ ] Test sign in lại

## 🎯 Quick Fix (Nếu Client Tồn Tại)

Nếu client đã tồn tại, chỉ cần:

1. **Vào Google Cloud Console** → **Credentials**
2. **Click vào OAuth client** (ID: `231692293394-5v3o1utvr68t42d6vhfc5nsn1tn8mc2o`)
3. **Verify redirect URIs** có:
   ```
   https://besideai.work/api/auth/callback/google
   https://www.besideai.work/api/auth/callback/google
   ```
4. **Nếu thiếu → Thêm và Save**
5. **Wait 5-10 phút**
6. **Test lại**

## 📚 Resources

- **Google Cloud Console**: https://console.cloud.google.com/
- **OAuth Credentials**: https://console.cloud.google.com/apis/credentials
- **OAuth Consent Screen**: https://console.cloud.google.com/apis/credentials/consent
- **NextAuth.js Docs**: https://next-auth.js.org/providers/google

---

**Next Step**: Kiểm tra Google Cloud Console và verify redirect URIs. Nếu client không tồn tại, tạo mới và update Vercel env vars.

