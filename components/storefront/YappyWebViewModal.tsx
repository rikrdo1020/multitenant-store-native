import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { YAPPY_CDN_URL } from "@/lib/constants";

export interface YappyPaymentParams {
  transactionId: string;
  documentName: string;
  token: string;
}

interface Props {
  visible: boolean;
  onCreatePayment: (aliasYappy: string) => Promise<YappyPaymentParams>;
  onSuccess: () => void;
  onError: () => void;
  onDismiss: () => void;
}

const buildHtml = (cdnUrl: string) => `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <script type="module" src="${cdnUrl}"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #fff;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 24px;
    }
    #screen-phone { width: 100%; max-width: 380px; }
    #screen-yappy {
      width: 100%;
      max-width: 380px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    h2 { font-size: 20px; font-weight: 700; color: #111; margin-bottom: 6px; }
    .subtitle { font-size: 14px; color: #666; margin-bottom: 28px; line-height: 1.5; }
    label { display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 6px; }
    input[type=tel] {
      width: 100%;
      padding: 13px 14px;
      border: 1.5px solid #ddd;
      border-radius: 10px;
      font-size: 18px;
      letter-spacing: 2px;
      outline: none;
      transition: border-color 0.2s;
    }
    input[type=tel]:focus { border-color: #ff6b00; }
    .hint { font-size: 11px; color: #999; margin-top: 5px; }
    .error { font-size: 12px; color: #e53e3e; margin-top: 6px; min-height: 16px; }
    #pay-btn {
      width: 100%;
      margin-top: 22px;
      padding: 15px;
      background: #ff6b00;
      color: #fff;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    #pay-btn:disabled { opacity: 0.45; cursor: not-allowed; }
    btn-yappy { display: block; width: 100%; }
    #dialog {
      position: fixed !important;
      inset: unset !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      margin: 0 !important;
    }
  </style>
</head>
<body>
  <div id="screen-phone">
    <h2>Pagar con Yappy</h2>
    <p class="subtitle">Ingresa el número de teléfono registrado en tu cuenta Yappy</p>
    <label for="alias-input">Número Yappy</label>
    <input type="tel" id="alias-input" placeholder="6000-0000" maxlength="9" autocomplete="tel">
    <p class="hint">Sin prefijo +507</p>
    <p class="error" id="error-msg"></p>
    <button id="pay-btn" disabled>Continuar con Yappy</button>
  </div>

  <div id="screen-yappy" style="display:none">
    <btn-yappy id="yappy-btn" theme="orange"></btn-yappy>
  </div>

  <script>
    var isNative = typeof window.ReactNativeWebView !== 'undefined';

    function postUp(msg) {
      var s = JSON.stringify(msg);
      if (isNative) window.ReactNativeWebView.postMessage(s);
      else window.parent.postMessage(s, '*');
    }

    var aliasInput  = document.getElementById('alias-input');
    var payBtn      = document.getElementById('pay-btn');
    var errorMsg    = document.getElementById('error-msg');
    var screenPhone = document.getElementById('screen-phone');
    var screenYappy = document.getElementById('screen-yappy');

    aliasInput.addEventListener('input', function () {
      var digits = this.value.replace(/\\D/g, '').slice(0, 8);
      this.value = digits.length > 4 ? digits.slice(0,4) + '-' + digits.slice(4) : digits;
      payBtn.disabled = !/^\\d{4}-\\d{4}$/.test(this.value);
      errorMsg.textContent = '';
    });

    payBtn.addEventListener('click', function () {
      var alias = aliasInput.value.trim();
      if (!/^\\d{4}-\\d{4}$/.test(alias)) {
        errorMsg.textContent = 'Formato inválido. Ejemplo: 6000-0000';
        return;
      }
      payBtn.disabled = true;
      payBtn.textContent = 'Procesando…';
      postUp({ type: 'createPayment', aliasYappy: alias });
    });

    window.addEventListener('message', function (e) {
      try {
        var data = JSON.parse(e.data);

        if (data.type === 'payment') {
          screenPhone.style.display = 'none';
          screenYappy.style.display = 'flex';
          document.getElementById('yappy-btn').eventPayment(data.params);
        }

        if (data.type === 'paymentError') {
          payBtn.disabled = false;
          payBtn.textContent = 'Continuar con Yappy';
          errorMsg.textContent = data.message || 'Error al procesar. Intenta nuevamente.';
        }
      } catch {
        // ignore
      }
    });

    window.addEventListener('load', function () {
      var btn = document.getElementById('yappy-btn');
      btn.addEventListener('eventSuccess', function () { postUp({ type: 'success' }); });
      btn.addEventListener('eventError',   function (e) { postUp({ type: 'error', detail: e.detail }); });
      postUp({ type: 'ready' });
    });
  </script>
</body>
</html>`;

const WebViewNative =
  Platform.OS !== "web"
    ? // eslint-disable-next-line @typescript-eslint/no-var-requires
      (require("react-native-webview").WebView as React.ComponentType<any>)
    : null;

export function YappyWebViewModal(props: Props) {
  return Platform.OS === "web" ? (
    <YappyWebViewWeb {...props} />
  ) : (
    <YappyWebViewNative {...props} />
  );
}

// ─── Native ──────────────────────────────────────────────────────────────────

function YappyWebViewNative({
  visible,
  onCreatePayment,
  onSuccess,
  onError,
  onDismiss,
}: Props) {
  const webViewRef = useRef<any>(null);
  const HTML = buildHtml(YAPPY_CDN_URL);

  const inject = (msg: object) => {
    const payload = JSON.stringify(msg);
    webViewRef.current?.injectJavaScript(`
      window.dispatchEvent(new MessageEvent('message', { data: ${JSON.stringify(payload)} }));
      true;
    `);
  };

  const handleMessage = async (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data) as {
        type: string;
        aliasYappy?: string;
      };
      if (data.type === "createPayment" && data.aliasYappy) {
        try {
          const params = await onCreatePayment(data.aliasYappy);
          inject({ type: "payment", params });
        } catch (err: any) {
          inject({
            type: "paymentError",
            message: err?.message ?? "Error al crear el pago",
          });
        }
      } else if (data.type === "success") {
        onSuccess();
      } else if (data.type === "error") {
        onError();
      }
    } catch {
      // ignore malformed messages
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeHit} onPress={onDismiss}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        {WebViewNative && (
          <WebViewNative
            ref={webViewRef}
            source={{ html: HTML }}
            onMessage={handleMessage}
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={["*"]}
            startInLoadingState
            renderLoading={() => (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color="#ff6b00" />
              </View>
            )}
            style={styles.fill}
          />
        )}
      </View>
    </Modal>
  );
}

// ─── Web ─────────────────────────────────────────────────────────────────────

function YappyWebViewWeb({
  visible,
  onCreatePayment,
  onSuccess,
  onError,
  onDismiss,
}: Props) {
  const iframeRef = useRef<any>(null);
  const HTML = buildHtml(YAPPY_CDN_URL);

  useEffect(() => {
    if (!visible) return;

    const handleMessage = async (e: MessageEvent) => {
      if (e.source !== iframeRef.current?.contentWindow) return;
      try {
        const data = JSON.parse(e.data as string) as {
          type: string;
          aliasYappy?: string;
        };

        const postDown = (msg: object) => {
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify(msg),
            "*",
          );
        };

        if (data.type === "createPayment" && data.aliasYappy) {
          try {
            const params = await onCreatePayment(data.aliasYappy);
            postDown({ type: "payment", params });
          } catch (err: any) {
            postDown({
              type: "paymentError",
              message: err?.message ?? "Error al crear el pago",
            });
          }
        } else if (data.type === "success") {
          onSuccess();
        } else if (data.type === "error") {
          onError();
        }
      } catch {}
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [visible, onCreatePayment, onSuccess, onError]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onDismiss}
      transparent={false}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeHit} onPress={onDismiss}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.fill}>
          {visible && (
            <iframe
              ref={iframeRef}
              srcDoc={HTML}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="Yappy Payment"
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  fill: { flex: 1 },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  closeHit: {
    height: 44,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  closeText: {
    fontSize: 18,
    color: "#555",
    lineHeight: 22,
  },
});
