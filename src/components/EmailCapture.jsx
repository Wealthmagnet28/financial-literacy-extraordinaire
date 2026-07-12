import { useState, useRef, useEffect } from "react";

export default function EmailCapture({ variant = "hero" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random() * 0.6 + 0.2,
    }));
    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.y -= s.speed;
        if (s.y < 0) { s.y = canvas.height; s.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 180, 255, ${s.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  const isInline = variant === "inline";

  return (
    <div style={{
      position: "relative", overflow: "hidden", borderRadius: "20px",
      border: "1px solid rgba(168,130,255,0.15)",
      background: "linear-gradient(135deg, rgba(18,10,35,0.95), rgba(30,15,55,0.9))",
      padding: isInline ? "24px 28px" : "48px 32px",
      maxWidth: isInline ? "480px" : "560px", margin: "32px auto",
      fontFamily: "'Poppins','Inter',sans-serif",
    }}>
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"relative", zIndex:1 }}>
        <div style={{
          position:"absolute", top:"-60px", right:"-40px", width:"180px", height:"180px",
          borderRadius:"50%", background:"radial-gradient(circle, rgba(168,130,255,0.2) 0%, transparent 70%)",
          pointerEvents:"none", zIndex:0,
        }} />

        {!isInline && (
          <>
            <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"3px", color:"#c8a0ff", marginBottom:"12px", textTransform:"uppercase" }}>CLUB FLE</p>
            <h2 style={{ fontSize:"clamp(22px,4vw,30px)", fontWeight:700, color:"#f0e8ff", lineHeight:1.25, marginBottom:"12px" }}>
              Level Up Your{" "}
              <span style={{ background:"linear-gradient(90deg,#c8a0ff,#ffb347)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Financial Future</span>
            </h2>
            <p style={{ fontSize:"14px", color:"rgba(200,190,220,0.75)", lineHeight:1.6, marginBottom:"24px", maxWidth:"420px" }}>
              Join thousands learning to master money — tips, tools, and insights delivered straight to your inbox.
            </p>
          </>
        )}

        {isInline && (
          <p style={{ fontSize:"14px", fontWeight:600, color:"#d8c8f0", marginBottom:"12px" }}>Stay in the loop — get updates free</p>
        )}

        {status === "success" ? (
          <div style={{
            display:"flex", alignItems:"center", gap:"16px", padding:"20px", borderRadius:"14px",
            background:"rgba(80,200,120,0.08)", border:"1px solid rgba(80,200,120,0.25)",
          }}>
            <span style={{ fontSize:"28px", color:"#50c878" }}>✦</span>
            <div>
              <p style={{ fontSize:"16px", fontWeight:700, color:"#50c878", marginBottom:"2px" }}>You're in!</p>
              <p style={{ fontSize:"13px", color:"rgba(200,220,200,0.7)", margin:0 }}>Check your inbox for a welcome from Club FLE.</p>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
              <input type="email" required placeholder="your@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)} disabled={status === "loading"}
                aria-label="Email address"
                style={{
                  flex:"1 1 220px", padding:"14px 18px", borderRadius:"12px",
                  border:"1px solid rgba(168,130,255,0.25)", background:"rgba(255,255,255,0.05)",
                  color:"#f0e8ff", fontSize:"15px", fontFamily:"'Inter',sans-serif", outline:"none",
                }}
              />
              <button onClick={handleSubmit} disabled={status === "loading"}
                style={{
                  padding:"14px 28px", borderRadius:"12px", border:"none",
                  background:"linear-gradient(135deg,#9b59f0,#e67e22)", color:"#fff",
                  fontSize:"15px", fontWeight:700, fontFamily:"'Poppins',sans-serif",
                  cursor: status === "loading" ? "wait" : "pointer", minWidth:"120px",
                  opacity: status === "loading" ? 0.75 : 1,
                }}>
                {status === "loading" ? "Sending..." : "Join Free"}
              </button>
            </div>
            {status === "error" && <p style={{ color:"#ff6b6b", fontSize:"13px", marginTop:"8px" }}>{errorMsg}</p>}
            <p style={{ fontSize:"11px", color:"rgba(200,190,220,0.45)", marginTop:"10px" }}>No spam, ever. Unsubscribe anytime.</p>
          </div>
        )}
      </div>
    </div>
  );
}
