/* expoort const activationTemplate = (link)=> `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Activation</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">

    <table role="presentation" align="center" cellspacing="0" cellpadding="0" width="600" style="margin: auto; background: #ffffff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <tr>
            <td style="padding: 20px 0; text-align: center;">
                <img src="your_logo_url" alt="Logo" width="200" style="display: block; margin: auto;">
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
                <h2 style="color: #333333;">Account Activation</h2>
                <p style="color: #555555; font-size: 16px;">Dear ${req.body.name},</p>
                <p style="color: #555555; font-size: 16px;">Thank you for registering with amazonjumia. To activate your account, please click the button below:</p>
                <p style="text-align: center; padding: 20px 0;">
                    <a href="[Activation_Link]" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Activate Your Account</a>
                </p>
                <p style="color: #555555; font-size: 16px;">If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
                <p style="text-align: center; font-size: 14px; color: #007bff;">[Activation_Link]</p>
                <p style="color: #555555; font-size: 16px;">Thank you for choosing [Your Website Name]. We look forward to having you as part of our community!</p>
                <p style="color: #555555; font-size: 16px;">Best regards,<br>[Your Website Name] Team</p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f4f4f4; padding: 20px; text-align: center;">
                <p style="color: #777777; font-size: 14px;">© 2024 [Your Website Name]. All rights reserved.</p>
            </td>
        </tr>
    </table>

</body>
</html>
` */