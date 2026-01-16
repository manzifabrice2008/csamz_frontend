# Troubleshooting Guide - CSAM Zaccaria TSS Website

## Issue: Blank White Screen

If you see a blank white screen when accessing http://localhost:8080, follow these steps:

### Quick Fix Steps:

1. **Run the startup script:**
   ```powershell
   .\start-dev.ps1
   ```

2. **Wait for the server to start** (you should see output like):
   ```
   VITE v5.x.x  ready in xxx ms
   ➜  Local:   http://localhost:8080/
   ```

3. **Open your browser** and go to: `http://localhost:8080`

4. **Hard refresh the page:**
   - Windows: `Ctrl + Shift + R` or `Ctrl + F5`
   - This clears the browser cache

### If the problem persists:

#### Check 1: Is the dev server running?
```powershell
# Check if node is running
Get-Process | Where-Object {$_.ProcessName -like "*node*"}
```

#### Check 2: Clear browser cache completely
1. Press `F12` to open Developer Tools
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

#### Check 3: Try a different port
Edit `vite.config.ts` and change port from 8080 to 3000:
```typescript
server: {
  host: "localhost",
  port: 3000,  // Changed from 8080
  ...
}
```

#### Check 4: Check browser console for errors
1. Press `F12` to open Developer Tools
2. Click the "Console" tab
3. Look for red error messages
4. Common errors and fixes:
   - **"Failed to fetch"** → Dev server not running
   - **"Module not found"** → Run `npm install`
   - **"Unexpected token"** → Syntax error in code

#### Check 5: Verify Node.js version
```powershell
node --version  # Should be v18 or higher
npm --version   # Should be v9 or higher
```

### Manual Startup (if script doesn't work):

```powershell
# Step 1: Stop all node processes
Stop-Process -Name "node" -Force

# Step 2: Install dependencies
npm install

# Step 3: Clear caches
Remove-Item -Recurse -Force .vite, dist -ErrorAction SilentlyContinue

# Step 4: Start dev server
npm run dev
```

### Still not working?

Try accessing the test page to verify the server is running:
- Open: `file:///c:/Users/EAGLE TECHNOLOGY/Downloads/Compressed/hey-friend-io-main/test.html`

If the test page shows but the React app doesn't:
1. Check `src/main.tsx` for errors
2. Check `src/App.tsx` for errors
3. Verify all imports are correct
4. Check that `index.html` has the correct script tag

### Common Solutions:

**Solution 1: Reinstall dependencies**
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

**Solution 2: Use a different browser**
- Try Chrome, Edge, or Firefox
- Disable browser extensions

**Solution 3: Check firewall/antivirus**
- Temporarily disable to test
- Add exception for Node.js

**Solution 4: Check if port 8080 is in use**
```powershell
netstat -ano | findstr :8080
```

## Need More Help?

Check the browser console (F12) and look for specific error messages. The error message will guide you to the exact problem.
