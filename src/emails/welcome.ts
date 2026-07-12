export function welcomeEmailHtml(email) {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#0d0618;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0618;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0"
        style="max-width:560px;width:100%;background:linear-gradient(135deg,#150d2e,#1e0f37);
               border-radius:20px;border:1px solid rgba(168,130,255,0.15);overflow:hidden;">
        <tr><td style="padding:40px 36px 20px;text-align:center;">
          <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:3px;color:#c8a0ff;text-transform:uppercase;">CLUB FLE</p>
          <h1 style="margin:0;font-size:26px;font-weight:700;color:#f0e8ff;line-height:1.3;">
            Welcome to Your Financial<br/>
            <span style="background:linear-gradient(90deg,#c8a0ff,#ffb347);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Literacy Journey</span>
          </h1>
        </td></tr>
        <tr><td style="padding:0 36px;"><div style="height:1px;background:linear-gradient(90deg,transparent,rgba(168,130,255,0.3),transparent);"></div></td></tr>
        <tr><td style="padding:28px 36px;">
          <p style="margin:0 0 18px;font-size:15px;color:#d0c4e8;line-height:1.7;">
            You just took the first step toward mastering your money. Club FLE is built to help you learn, grow, and build real financial skills — no matter where you're starting from.
          </p>
          <p style="margin:0 0 18px;font-size:15px;color:#d0c4e8;line-height:1.7;">Here's what you can expect:</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:12px 16px;background:rgba(168,130,255,0.06);border-radius:12px;">
              <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#c8a0ff;">✦ Smart Money Tips</p>
              <p style="margin:0;font-size:13px;color:rgba(200,190,220,0.7);line-height:1.5;">Practical, age-appropriate insights on saving, spending, and growing wealth.</p>
            </td></tr>
            <tr><td style="height:10px;"></td></tr>
            <tr><td style="padding:12px 16px;background:rgba(230,126,34,0.06);border-radius:12px;">
              <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#ffb347;">✦ New Feature Drops</p>
              <p style="margin:0;font-size:13px;color:rgba(200,190,220,0.7);line-height:1.5;">Be the first to explore AI coaching, simulators, and interactive challenges.</p>
            </td></tr>
            <tr><td style="height:10px;"></td></tr>
            <tr><td style="padding:12px 16px;background:rgba(80,200,120,0.06);border-radius:12px;">
              <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#50c878;">✦ Community & Events</p>
              <p style="margin:0;font-size:13px;color:rgba(200,190,220,0.7);line-height:1.5;">Join challenges, earn badges, and connect with a community that gets it.</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td align="center" style="padding:8px 36px 32px;">
          <a href="https://clubfle.com" style="display:inline-block;padding:14px 36px;border-radius:12px;background:linear-gradient(135deg,#9b59f0,#e67e22);color:#fff;font-size:15px;font-weight:700;text-decoration:none;">Explore Club FLE →</a>
        </td></tr>
        <tr><td style="padding:20px 36px 32px;text-align:center;border-top:1px solid rgba(168,130,255,0.1);">
          <p style="margin:0 0 6px;font-size:11px;color:rgba(200,190,220,0.35);">You're receiving this because you signed up at Club FLE.</p>
          <p style="margin:0;font-size:11px;color:rgba(200,190,220,0.35);"><a href="https://clubfle.com/unsubscribe?email=${encodeURIComponent(email)}" style="color:#c8a0ff;text-decoration:underline;">Unsubscribe</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}
