const DEVICE_STORAGE_KEY = "attendance_device_id";

function generateDeviceId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return (
    "device-" + Date.now() + "-" + Math.random().toString(36).substring(2, 10)
  );
}

function getDeviceId() {
  let deviceId = localStorage.getItem(DEVICE_STORAGE_KEY);

  if (!deviceId) {
    deviceId = generateDeviceId();

    localStorage.setItem(DEVICE_STORAGE_KEY, deviceId);
  }

  return deviceId;
}

function getPlatform() {
  const userAgent = navigator.userAgent || "";

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  if (/iphone|ipad|ipod/i.test(userAgent)) {
    return "iOS";
  }

  if (/windows/i.test(userAgent)) {
    return "Windows";
  }

  if (/macintosh|mac os x/i.test(userAgent)) {
    return "macOS";
  }

  if (/linux/i.test(userAgent)) {
    return "Linux";
  }

  return "Unknown";
}

function getBrowser() {
  const userAgent = navigator.userAgent || "";

  if (/edg/i.test(userAgent)) {
    return "Microsoft Edge";
  }

  if (/opr|opera/i.test(userAgent)) {
    return "Opera";
  }

  if (/chrome|crios/i.test(userAgent)) {
    return "Google Chrome";
  }

  if (/firefox|fxios/i.test(userAgent)) {
    return "Mozilla Firefox";
  }

  if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent)) {
    return "Safari";
  }

  return "Browser";
}

function getDeviceName() {
  const userAgent = navigator.userAgent || "";

  // Android
  if (/android/i.test(userAgent)) {
    const match = userAgent.match(
      /Android[^;]*;\s*(?:wv;\s*)?([^;)]+)(?:\)|;)/i,
    );

    if (match?.[1]) {
      let model = match[1].trim();

      model = model
        .replace(/Build\/.*$/i, "")
        .replace(/;\s*wv$/i, "")
        .trim();

      if (model && model.length > 1) {
        return model;
      }
    }

    return "Perangkat Android";
  }

  // iPhone
  if (/iphone/i.test(userAgent)) {
    return "iPhone";
  }

  // iPad
  if (/ipad/i.test(userAgent)) {
    return "iPad";
  }

  // Windows
  if (/windows/i.test(userAgent)) {
    return "PC Windows";
  }

  // macOS
  if (/macintosh|mac os x/i.test(userAgent)) {
    return "Mac";
  }

  // Linux
  if (/linux/i.test(userAgent)) {
    return "Linux PC";
  }

  return "Perangkat Tidak Dikenal";
}

export function getDeviceInfo() {
  return {
    deviceId: getDeviceId(),
    deviceName: getDeviceName(),
    platform: getPlatform(),
    browser: getBrowser(),
  };
}
