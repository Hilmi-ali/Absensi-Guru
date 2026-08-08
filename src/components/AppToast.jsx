import { useEffect } from "react";

function AppToast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const typeConfig = {
    success: {
      icon: "✓",
      iconBg: "#ECFDF3",
      iconColor: "#039855",
      line: "#12B76A",
    },
    error: {
      icon: "×",
      iconBg: "#FEF3F2",
      iconColor: "#D92D20",
      line: "#F04438",
    },
    warning: {
      icon: "!",
      iconBg: "#FFFAEB",
      iconColor: "#DC6803",
      line: "#F79009",
    },
    info: {
      icon: "i",
      iconBg: "#EFF8FF",
      iconColor: "#1570EF",
      line: "#2E90FA",
    },
  };

  const config = typeConfig[toast.type] || typeConfig.info;

  const styles = {
    wrapper: {
      position: "fixed",
      top: 20,
      left: "50%",
      transform: "translateX(-50%)",
      width: "calc(100% - 32px)",
      maxWidth: 420,
      zIndex: 99999,
      pointerEvents: "none",
    },

    toast: {
      position: "relative",
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      background: "#FFFFFF",
      border: "1px solid #EAECF0",
      borderRadius: 16,
      padding: "14px 14px 14px 16px",
      boxShadow:
        "0 12px 30px rgba(16,24,40,0.12), 0 2px 6px rgba(16,24,40,0.06)",
      overflow: "hidden",
      pointerEvents: "auto",
    },

    icon: {
      width: 34,
      height: 34,
      minWidth: 34,
      borderRadius: 10,
      background: config.iconBg,
      color: config.iconColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 18,
      fontWeight: 700,
      lineHeight: 1,
    },

    content: {
      flex: 1,
      minWidth: 0,
      paddingTop: 1,
    },

    title: {
      margin: 0,
      fontSize: 14,
      fontWeight: 700,
      color: "#101828",
      lineHeight: 1.4,
    },

    message: {
      margin: "3px 0 0",
      fontSize: 13,
      color: "#667085",
      lineHeight: 1.45,
    },

    close: {
      width: 28,
      height: 28,
      border: "none",
      background: "transparent",
      color: "#98A2B3",
      cursor: "pointer",
      fontSize: 20,
      lineHeight: 1,
      padding: 0,
      marginTop: -3,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    progress: {
      position: "absolute",
      left: 0,
      bottom: 0,
      height: 2,
      width: "100%",
      background: config.line,
      transformOrigin: "left",
      animation: "toastProgress 3.5s linear forwards",
    },
  };

  return (
    <>
      <style>
        {`
          @keyframes toastProgress {
            from {
              transform: scaleX(1);
            }
            to {
              transform: scaleX(0);
            }
          }

          @keyframes toastIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .app-toast {
            animation: toastIn 0.22s ease-out;
          }

          .app-toast-close:hover {
            background: #F2F4F7 !important;
            color: #475467 !important;
          }

          @media (max-width: 480px) {
            .app-toast-wrapper {
              top: 12px !important;
              width: calc(100% - 24px) !important;
            }
          }
        `}
      </style>

      <div className="app-toast-wrapper" style={styles.wrapper}>
        <div className="app-toast" style={styles.toast}>
          <div style={styles.icon}>{config.icon}</div>

          <div style={styles.content}>
            <p style={styles.title}>{toast.title}</p>
            <p style={styles.message}>{toast.message}</p>
          </div>

          <button
            className="app-toast-close"
            style={styles.close}
            onClick={onClose}
            aria-label="Tutup"
          >
            ×
          </button>

          <div style={styles.progress} />
        </div>
      </div>
    </>
  );
}

export default AppToast;
