# Fix Google OAuth Error - "OAuth client was not found"

## 🔴 Lỗi Hiện Tại

```
Access blocked: Authorization Error
Error 401: invalid_client
The OAuth client was not found.
```

## 🔍 Nguyên Nhân

Lỗi này xảy ra khi:
1. Google OAuth Client ID không tồn tại hoặc đã bị xóa
2. Redirect URIs không được cấu hình đúng trong Google Cloud Console
3. Client ID/Secret không khớp với Google Cloud Console

## ✅ Cách Sửa

### Bước 1: Kiểm Tra Google Cloud Console

1. **Truy cập Google Cloud Console:**
   - Go to: https://console.cloud.google.com/
   - Select project: `besideai-login-frontend`

2. **Kiểm tra OAuth 2.0 Client:**
   - Go to: **APIs & Services** → **Credentials**
   - Tìm OAuth 2.0 Client ID: `231692293394-5v3o1utvr68t42d6vhfc5nsn1tn8mc2o`
   - Click vào để xem chi tiết

3. **Kiểm tra Redirect URIs:**
   - Trong OAuth client settings, scroll xuống **Authorized redirect URIs**
   - Đảm bảo có các URIs sau:
     ```
     https://besideai.work/api/auth/callback/google
     https://www.besideai.work/api/auth/callback/google
     https://besideai.work/callback
     https://www.besideai.work/callback
     ```

### Bước 2: Thêm Redirect URIs (Nếu Thiếu)

Nếu các redirect URIs chưa có, thêm chúng:

1. Trong OAuth client settings, click **Edit**
2. Scroll xuống **Authorized redirect URIs**
3. Click **+ ADD URI**
4. Thêm từng URI một:
   - `https://besideai.work/api/auth/callback/google`
   - `https://www.besideai.work/api/auth/callback/google`
   - `https://besideai.work/callback`
   - `https://www.besideai.work/callback`
5. Click **SAVE**

### Bước 3: Kiểm Tra Client ID và Secret

1. **Verify Client ID:**
   - Client ID phải là: `231692293394-5v3o1utvr68t42d6vhfc5nsn1tn8mc2o`
   - Nếu không thấy, có thể client đã bị xóa

2. **Verify Client Secret:**
   - Client Secret phải là: `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`
   - Nếu secret khác, cần update trong Vercel

3. **Nếu Client Bị Xóa:**
   - Tạo OAuth client mới
   - Copy Client ID và Secret mới
   - Update trong Vercel

### Bước 4: Update Vercel Environment Variables (Nếu Cần)

Nếu bạn đã tạo client mới hoặc secret thay đổi:

```bash
cd Frontend

# Update Client ID
echo "YOUR_NEW_CLIENT_ID" | vercel env add GOOGLE_CLIENT_ID production

# Update Client Secret
echo "YOUR_NEW_CLIENT_SECRET" | vercel env add GOOGLE_CLIENT_SECRET production
```

### Bước 5: Redeploy

Sau khi cập nhật:

```bash
vercel deploy --prod
```

## 🔧 Tạo OAuth Client Mới (Nếu Cần)

Nếu client không tồn tại, tạo mới:

1. **Truy cập Google Cloud Console:**
   - https://console.cloud.google.com/
   - Select project: `besideai-login-frontend`

2. **Tạo OAuth Client:**
   - Go to: **APIs & Services** → **Credentials**
   - Click **+ CREATE CREDENTIALS** → **OAuth client ID**
   - Application type: **Web application**
   - Name: `BesideAI Web Client`

3. **Cấu hình Redirect URIs:**
   - Authorized JavaScript origins:
     ```
     https://besideai.work
     https://www.besideai.work
     ```
   - Authorized redirect URIs:
     ```
     https://besideai.work/api/auth/callback/google
     https://www.besideai.work/api/auth/callback/google
     ```

4. **Lưu Client ID và Secret:**
   - Copy Client ID
   - Copy Client Secret
   - Update trong Vercel

## 📋 Checklist

- [ ] Kiểm tra OAuth client tồn tại trong Google Cloud Console
- [ ] Verify Client ID: `231692293394-5v3o1utvr68t42d6vhfc5nsn1tn8mc2o`
- [ ] Verify Client Secret: `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`
- [ ] Thêm redirect URIs nếu thiếu:
  - `https://besideai.work/api/auth/callback/google`
  - `https://www.besideai.work/api/auth/callback/google`
- [ ] Update Vercel env vars nếu cần
- [ ] Redeploy to production
- [ ] Test sign in lại

## 🧪 Test Sau Khi Sửa

1. **Clear browser cache** hoặc dùng incognito mode
2. **Visit**: https://besideai.work/sign-in
3. **Click "Continue with Google"**
4. **Sign in** với `lam.env90@gmail.com`
5. **Verify** redirect về app thành công

## 🚨 Lưu Ý

- **Redirect URIs phải match chính xác** (case-sensitive)
- **Không có trailing slash** trong redirect URIs
- **Wait 5-10 phút** sau khi update redirect URIs (Google cần time để propagate)
- **Clear browser cache** sau khi sửa

## 📚 Resources

- **Google Cloud Console**: https://console.cloud.google.com/
- **OAuth 2.0 Setup**: https://console.cloud.google.com/apis/credentials
- **NextAuth.js Google Provider**: https://next-auth.js.org/providers/google

---

**Status**: Cần kiểm tra và cấu hình lại Google OAuth Client trong Google Cloud Console.

