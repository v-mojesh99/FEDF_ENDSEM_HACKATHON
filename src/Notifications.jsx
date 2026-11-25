import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

const EMAIL_CONFIG = {
  serviceId: "service_1mlyjr8",
  templateId: "template_pjxc1nn",
  publicKey: "S2zEC9013v6fsV0Vp"
};

export const recruitmentMessages = {
  Applied: "Your application is under review.",
  Shortlisted: "Congratulations! You have been shortlisted.",
  Interview: "You have been invited for an interview.",
  Selected: "Congratulations! You have been selected.",
  Rejected: "Unfortunately, your application was not selected."
};

export async function sendRecruitmentEmail(application, status) {
  if (status === "Applied") return;

  if (
    EMAIL_CONFIG.serviceId === "YOUR_SERVICE_ID" ||
    EMAIL_CONFIG.templateId === "YOUR_TEMPLATE_ID" ||
    EMAIL_CONFIG.publicKey === "YOUR_PUBLIC_KEY"
  ) {
    throw new Error("Configure EmailJS first.");
  }

  return emailjs.send(
    EMAIL_CONFIG.serviceId,
    EMAIL_CONFIG.templateId,
    {
      to_name: application.name,
      to_email: application.email,
      job_title: application.title,
      company_name: application.company,
      status: status,
      subject: "CareerSphere - Application " + status,
      message: recruitmentMessages[status]
    },
    {
      publicKey: EMAIL_CONFIG.publicKey
    }
  );
}

function createId() {
  return Date.now() + "-" + Math.random().toString(36).slice(2);
}

export function useNotifications() {
  const [notifications, setNotifications] = useState(() => {
    try {
      const data = JSON.parse(
        localStorage.getItem("cs3-notifications")
      );

      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "cs3-notifications",
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error(error);
    }
  }, [notifications]);

  function showToast(title, message, type = "success") {
    const id = createId();

    setToasts(old => [
      ...old,
      { id, title, message, type }
    ]);

    setTimeout(() => {
      setToasts(old =>
        old.filter(t => t.id !== id)
      );
    }, 5000);
  }

  function closeToast(id) {
    setToasts(old =>
      old.filter(t => t.id !== id)
    );
  }

  function addNotification(
    userId,
    title,
    message,
    type = "success"
  ) {
    setNotifications(old => [
      {
        id: createId(),
        userId,
        title,
        message,
        type,
        date: new Date().toISOString(),
        read: false
      },
      ...old
    ]);
  }

  function markAllRead(userId) {
    setNotifications(old =>
      old.map(n =>
        n.userId === userId
          ? { ...n, read: true }
          : n
      )
    );
  }

  function markRead(userId, id) {
    setNotifications(old =>
      old.map(n =>
        n.userId === userId && n.id === id
          ? { ...n, read: true }
          : n
      )
    );
  }

  function clearHistory(userId) {
    setNotifications(old =>
      old.filter(n => n.userId !== userId)
    );
  }

  return {
    notifications,
    toasts,
    showToast,
    closeToast,
    addNotification,
    markAllRead,
    markRead,
    clearHistory
  };
}

export function ToastNotifications({ toasts, onClose }) {
  return (
    <div
      className="toast-container"
      aria-live="polite"
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 99999,
        display: "grid",
        gap: "12px",
        width: "min(360px, calc(100vw - 40px))"
      }}
    >
      {toasts.map(t => (
        <div
          key={t.id}
          className={`toast-message toast-${t.type}`}
          style={{
            background: "#ffffff",
            color: "#0f172a",
            padding: "18px",
            borderRadius: "12px",
            boxShadow: "0 8px 30px #0003",
            borderLeft: `5px solid ${
              t.type === "error" ? "#dc2626" : "#16a34a"
            }`,
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <div className="toast-icon">
            {t.type === "error" ? "❌" : "✅"}
          </div>

          <div style={{ flex: 1 }}>
            <strong>{t.title}</strong>
            <p style={{ margin: "5px 0" }}>
              {t.message}
            </p>
          </div>

          <button
            className="toast-close"
            onClick={() => onClose(t.id)}
            aria-label="Close notification"
            style={{
              background: "transparent",
              color: "#64748b",
              padding: "5px"
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export function NotificationCenter({
  notifications,
  onReadAll,
  onRead,
  onClear
}) {
  const [open, setOpen] = useState(false);

  const unread = notifications.filter(
    n => !n.read
  ).length;

  return (
    <div
      className="notification-center"
      style={{ position: "relative" }}
    >
      <button
        className="notification-bell"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        aria-expanded={open}
        style={{
          position: "relative",
          background: "#eef2ff",
          color: "#4f46e5",
          borderRadius: "10px",
          padding: "10px"
        }}
      >
        🔔

        {unread > 0 && (
          <span
            className="notification-count"
            style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              background: "#dc2626",
              color: "white",
              borderRadius: "20px",
              padding: "2px 6px",
              fontSize: "11px"
            }}
          >
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="notification-panel"
          style={{
            position: "absolute",
            right: 0,
            top: "55px",
            width: "min(340px, 80vw)",
            background: "white",
            color: "#0f172a",
            borderRadius: "14px",
            boxShadow: "0 10px 40px #0003",
            padding: "16px",
            zIndex: 9999
          }}
        >
          <div
            className="notification-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <h3>Notifications</h3>

            <button onClick={() => setOpen(false)}>
              ×
            </button>
          </div>

          <p>{unread} unread notifications</p>

          <button onClick={onReadAll}>
            Mark all as read
          </button>

          <div
            className="notification-list"
            style={{
              maxHeight: "350px",
              overflowY: "auto",
              marginTop: "12px"
            }}
          >
            {notifications.length === 0 && (
              <div>
                <h3>No notifications</h3>
                <p>Your updates will appear here.</p>
              </div>
            )}

            {notifications.map(n => (
              <div
                key={n.id}
                className="notification-item"
                style={{
                  background: n.read
                    ? "#f8fafc"
                    : "#eef2ff",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "10px"
                }}
              >
                <strong>{n.title}</strong>

                <p>{n.message}</p>

                <small>
                  {new Date(n.date).toLocaleString()}
                </small>

                {!n.read && (
                  <div style={{ marginTop: "8px" }}>
                    <button onClick={() => onRead(n.id)}>
                      Mark as read
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={onClear}
            style={{
              background: "#fee2e2",
              color: "#dc2626",
              marginTop: "10px",
              width: "100%"
            }}
          >
            Clear History
          </button>
        </div>
      )}
    </div>
  );
}