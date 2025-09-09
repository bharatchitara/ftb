import smtplib
from email.mime.text import MIMEText
from configloader import confighelper


def get_email_config():
    ftbtoolconfig = confighelper.getconfig()
    smtpconfig = ftbtoolconfig.get("smtpconfig")

    return (
        smtpconfig['host'],  
        smtpconfig['port'],  
        smtpconfig['user'],  
        smtpconfig['password'],
    )


def send_email(body, subject, from_email, to_email):
    # this function can be expanded for custom email sending logic if needed

    msg = MIMEText(body)

    msg["Subject"] = subject
    msg["From"] = from_email
    
    if (to_email):
        msg["To"] = ', '.join(to_email)

    host, port, user, password = get_email_config()
    
    try:
        server = smtplib.SMTP_SSL(host, port)
    except Exception as e:
        print(f"SMTP connection start error")
        return None
    
    try:
        server.login(user, password)
    except Exception as e:
        print(f"SMTP connection cred error")
        return None
    
    try:
        server.sendmail(from_email, to_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"SMTP connection email send error")
        server.quit()
        return None


