export default function MobileWarning() {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: '#fff',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 20,
      padding: 24,
      textAlign: 'center',
      color: '#222' // <-- Make sure text is dark!
    }}>
      <strong>Mobile Not Supported</strong>
      <p>
        This website is not fully compatible with mobile devices.<br />
        Please use a desktop or laptop for the best experience.
      </p>
    </div>
  );
}