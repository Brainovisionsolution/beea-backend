import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Contact Information
const CONTACT_INFO = {
  phone: "+91 7207775039",
  email: "beea@brainovision.in",
  website: "https://beea.in",
  support: "support@brainovision.in"
};

// Premium Email Template Generator - Phase 1: Initial Nomination
const generatePhase1Template = (userData, verificationLink) => {
  const currentYear = new Date().getFullYear();
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BEEA Nomination - Phase 1</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Poppins', Arial, sans-serif; background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0d1230 100%);">
      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0d1230 100%); padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: rgba(13, 18, 48, 0.95); backdrop-filter: blur(10px); border-radius: 20px; box-shadow: 0 25px 50px rgba(0,0,0,0.3), 0 0 0 1px rgba(212, 175, 55, 0.2); overflow: hidden;">
              
              <!-- Header with Gold Gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%); padding: 45px 30px; text-align: center; border-bottom: 2px solid #D4AF37;">
                  <h1 style="background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 2px;">BHARAT EDUCATION</h1>
                  <h2 style="background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 5px 0 0; font-size: 20px; letter-spacing: 1px;">EXCELLENCE AWARDS</h2>
                  <p style="color: #D4AF37; margin: 20px 0 0; font-size: 14px; letter-spacing: 1px;">✨ Phase 1: Nomination Received ✨</p>
                </td>
               </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 45px 35px;">
                  <h3 style="background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 15px; font-size: 24px;">Dear ${userData.fullName},</h3>
                  
                  <p style="color: #a0a0c0; line-height: 1.8; margin: 0 0 25px;">
                    Thank you for submitting your nomination for the <strong style="color: #D4AF37;">Bharat Education Excellence Awards ${currentYear}</strong>. 
                    This is <strong style="color: #FFD700;">Phase 1 of our 3-phase selection process</strong>.
                  </p>
                  
                  <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%); padding: 25px; border-radius: 16px; margin: 25px 0; border-left: 4px solid #D4AF37;">
                    <h4 style="color: #D4AF37; margin: 0 0 15px; font-size: 18px;">📊 Multi-Phase Selection Process</h4>
                    <table width="100%" cellpadding="10">
                      <tr>
                        <td style="border-bottom: 1px solid rgba(212, 175, 55, 0.2); color: #a0a0c0;">
                          <strong style="color: #FFD700;">✅ Phase 1:</strong>
                         </td
                        <td style="border-bottom: 1px solid rgba(212, 175, 55, 0.2); color: #a0a0c0;">
                          Nomination Submission & Verification (Current)
                         </td
                      </tr>
                      <tr>
                        <td style="border-bottom: 1px solid rgba(212, 175, 55, 0.2); color: #a0a0c0;">
                          <strong style="color: #FFD700;">📝 Phase 2:</strong>
                         </td
                        <td style="border-bottom: 1px solid rgba(212, 175, 55, 0.2); color: #a0a0c0;">
                          Detailed Application Form (Shortlisted Only)
                         </td
                      </tr>
                      <tr>
                        <td style="color: #a0a0c0;">
                          <strong style="color: #FFD700;">🗳️ Phase 3:</strong>
                         </td
                        <td style="color: #a0a0c0;">
                          Public Voting & Award Ceremony
                         </td
                      </tr>
                    </table>
                  </div>
                  
                  <div style="text-align: center; margin: 35px 0;">
                    <a href="${verificationLink}" 
                       style="display: inline-block; 
                              background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
                              color: #0a0e27; 
                              padding: 14px 45px; 
                              text-decoration: none; 
                              border-radius: 50px; 
                              font-weight: 700;
                              letter-spacing: 1px;
                              text-transform: uppercase;
                              box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
                              transition: all 0.3s ease;">
                      ✨ Verify & Complete Phase 1 ✨
                    </a>
                  </div>
                  
                  <div style="background: rgba(212, 175, 55, 0.08); padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(212, 175, 55, 0.2);">
                    <h5 style="color: #D4AF37; margin: 0 0 12px; font-size: 16px;">📌 What's Next?</h5>
                    <ul style="color: #a0a0c0; margin: 0; padding-left: 20px; line-height: 1.8;">
                      <li>Click the verification link above to confirm your nomination</li>
                      <li>Our panel will review your Phase 1 submission</li>
                      <li>Shortlisted candidates will receive Phase 2 link within 7 days</li>
                      <li>Phase 2 will include detailed questions about your achievements</li>
                    </ul>
                  </div>
                  
                  <div style="margin: 25px 0; padding: 18px; background: rgba(212, 175, 55, 0.12); border-radius: 12px; border: 1px solid rgba(212, 175, 55, 0.3);">
                    <p style="color: #D4AF37; margin: 0; font-size: 14px; text-align: center;">
                      <strong>📞 Need Assistance?</strong><br>
                      <span style="color: #a0a0c0;">Call us at: ${CONTACT_INFO.phone} | Email: ${CONTACT_INFO.email}</span>
                    </p>
                  </div>
                  
                  <!-- Nomination Summary -->
                  <div style="margin: 30px 0 0; padding: 20px; background: rgba(0,0,0,0.2); border-radius: 12px;">
                    <h5 style="color: #D4AF37; margin: 0 0 10px; font-size: 14px;">📋 Nomination Summary:</h5>
                    <table width="100%" cellpadding="6">
                      <tr>
                        <td style="color: #a0a0c0;"><strong>Institution:</strong> </td
                        <td style="color: #ffffff;">${userData.collegeName}</td>
                      </tr>
                      <tr>
                        <td style="color: #a0a0c0;"><strong>Designation:</strong> </td
                        <td style="color: #ffffff;">${userData.designation || "Not specified"}</td>
                      </tr>
                      <tr>
                        <td style="color: #a0a0c0;"><strong>Department:</strong> </td
                        <td style="color: #ffffff;">${userData.department || "Not specified"}</td>
                      </tr>
                    </table>
                  </div>
                 </td
                </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%); padding: 35px; text-align: center; border-top: 1px solid rgba(212, 175, 55, 0.2);">
                  <p style="color: #D4AF37; margin: 0 0 10px; font-weight: 600; letter-spacing: 1px;">BHARAT EDUCATION EXCELLENCE AWARDS</p>
                  <p style="color: #a0a0c0; margin: 0; font-size: 12px;">© ${currentYear} All Rights Reserved</p>
                  <p style="color: #8888aa; margin: 15px 0 0; font-size: 11px;">${CONTACT_INFO.phone} | ${CONTACT_INFO.email}</p>
                  <p style="color: #8888aa; margin: 10px 0 0; font-size: 11px;">🏆 Celebrating Excellence in Education</p>
                 </td
                </tr>
              </table>
            </td
          </tr>
        </table>
      </body>
    </html>
  `;
};

// Phase 2: Detailed Application Form Link (For Shortlisted Candidates)
export const sendPhase2Link = async (to, userData) => {
  const phase2Link = `${process.env.FRONTEND_URL}/phase2-form?token=${userData.uniqueToken}&email=${to}`;
  
  const template = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Poppins', Arial, sans-serif; background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0d1230 100%); margin: 0; padding: 0; }
        .container { max-width: 600px; margin: auto; background: rgba(13, 18, 48, 0.95); border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.3); border: 1px solid rgba(212, 175, 55, 0.2); }
        .header { background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%); padding: 45px; text-align: center; border-bottom: 2px solid #D4AF37; }
        .content { padding: 45px; }
        .button { background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%); color: #0a0e27; padding: 14px 40px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .badge { background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%); color: #0a0e27; padding: 8px 20px; border-radius: 50px; display: inline-block; font-weight: 700; margin-bottom: 20px; }
      </style>
    </head>
    <body style="background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0d1230 100%); padding: 40px 20px;">
      <div class="container">
        <div class="header">
          <div class="badge">✨ SHORTLISTED CANDIDATE ✨</div>
          <h1 style="background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 20px 0 0;">🎉 Congratulations!</h1>
          <p style="color: #D4AF37; margin: 10px 0 0;">You've been SHORTLISTED for Phase 2</p>
        </div>
        <div class="content">
          <h3 style="background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Dear ${userData.fullName},</h3>
          
          <p style="color: #a0a0c0; line-height: 1.8;">We are pleased to inform you that after careful review of your Phase 1 nomination, you have been <strong style="color: #FFD700;">SHORTLISTED</strong> for the next round!</p>
          
          <div style="background: rgba(212, 175, 55, 0.1); padding: 25px; border-radius: 16px; margin: 25px 0; border-left: 4px solid #D4AF37;">
            <h4 style="color: #D4AF37; margin: 0 0 15px;">📝 Phase 2: Detailed Application</h4>
            <p style="color: #a0a0c0; margin: 0 0 10px;">Please complete the detailed application form with:</p>
            <ul style="color: #a0a0c0; line-height: 1.8;">
              <li>Your achievements & contributions</li>
              <li>Supporting documents & certificates</li>
              <li>Impact stories & testimonials</li>
              <li>Media coverage & recognition</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${phase2Link}" class="button">📋 Access Phase 2 Application</a>
          </div>
          
          <div style="background: rgba(212, 175, 55, 0.08); padding: 18px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(212, 175, 55, 0.2);">
            <p style="color: #D4AF37; margin: 0; font-size: 13px; text-align: center;">
              <strong>⏰ Deadline:</strong> Please complete Phase 2 within 7 days<br>
              <strong>📞 Support:</strong> ${CONTACT_INFO.phone} | ${CONTACT_INFO.email}
            </p>
          </div>
        </div>
        <div style="background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%); padding: 25px; text-align: center; border-top: 1px solid rgba(212, 175, 55, 0.2);">
          <p style="color: #a0a0c0; font-size: 12px;">© ${new Date().getFullYear()} BEEA | ${CONTACT_INFO.phone}</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await transporter.sendMail({
    from: `"BEEA Team" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: "🎉 CONGRATULATIONS! You've Been Shortlisted - Phase 2 Link Inside",
    html: template,
  });
};

// Phase 3: Voting Started Notification
export const sendVotingNotification = async (to, userData, votingLink) => {
  const template = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Poppins', Arial, sans-serif; background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0d1230 100%); margin: 0; padding: 0; }
        .container { max-width: 600px; margin: auto; background: rgba(13, 18, 48, 0.95); border-radius: 20px; overflow: hidden; border: 1px solid rgba(212, 175, 55, 0.2); }
        .header { background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%); padding: 45px; text-align: center; border-bottom: 2px solid #D4AF37; }
        .content { padding: 45px; }
        .vote-button { background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%); color: #0a0e27; padding: 14px 40px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
      </style>
    </head>
    <body style="background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0d1230 100%); padding: 40px 20px;">
      <div class="container">
        <div class="header">
          <h1 style="background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">🗳️ Voting Phase Started!</h1>
          <p style="color: #D4AF37;">Phase 3: Public Voting Now Open</p>
        </div>
        <div class="content">
          <h3 style="background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Dear ${userData.fullName},</h3>
          
          <p style="color: #a0a0c0; line-height: 1.8;">Congratulations on successfully completing Phase 2! You are now officially in the <strong style="color: #FFD700;">VOTING PHASE</strong> of the Bharat Education Excellence Awards.</p>
          
          <div style="background: rgba(212, 175, 55, 0.1); padding: 25px; border-radius: 16px; text-align: center; margin: 25px 0;">
            <h4 style="color: #D4AF37; margin: 0 0 15px;">📢 Share & Get Votes!</h4>
            <p style="color: #a0a0c0;">Share your nomination link with colleagues, students, and well-wishers to gather maximum votes.</p>
            <div style="margin: 25px 0;">
              <a href="${votingLink}" class="vote-button">🗳️ Vote for Me</a>
            </div>
          </div>
          
          <div style="margin: 25px 0;">
            <h4 style="color: #D4AF37;">🏆 Award Ceremony Details</h4>
            <p style="color: #a0a0c0;">Top vote-getters will be invited to the Grand Award Ceremony:</p>
            <ul style="color: #a0a0c0; line-height: 1.8;">
              <li><strong style="color: #D4AF37;">Date:</strong> To be announced</li>
              <li><strong style="color: #D4AF37;">Venue:</strong> Prestigious venue in New Delhi</li>
              <li><strong style="color: #D4AF37;">Chief Guests:</strong> Eminent educationists & dignitaries</li>
            </ul>
          </div>
          
          <div style="background: rgba(212, 175, 55, 0.08); padding: 15px; border-radius: 12px; text-align: center;">
            <p style="color: #D4AF37; margin: 0; font-size: 13px;">
              <strong>📞 Campaign Support:</strong> ${CONTACT_INFO.phone} | ${CONTACT_INFO.email}
            </p>
          </div>
        </div>
        <div style="background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%); padding: 25px; text-align: center; border-top: 1px solid rgba(212, 175, 55, 0.2);">
          <p style="color: #a0a0c0; font-size: 12px;">Best of luck! - BEEA Team</p>
          <p style="color: #8888aa; font-size: 11px;">${CONTACT_INFO.phone} | ${CONTACT_INFO.email}</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await transporter.sendMail({
    from: `"BEEA Team" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: "🗳️ VOTING STARTED! Phase 3 - Bharat Education Excellence Awards",
    html: template,
  });
};

// Winner Announcement Email
export const sendWinnerAnnouncement = async (to, userData, awardCategory) => {
  const template = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Poppins', Arial, sans-serif; background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0d1230 100%); margin: 0; padding: 0; }
        .container { max-width: 600px; margin: auto; background: rgba(13, 18, 48, 0.95); border-radius: 20px; overflow: hidden; border: 2px solid #D4AF37; }
        .header { background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%); padding: 45px; text-align: center; }
        .trophy { font-size: 70px; }
      </style>
    </head>
    <body style="background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0d1230 100%); padding: 40px 20px;">
      <div class="container">
        <div class="header">
          <div class="trophy">🏆</div>
          <h1 style="color: #0a0e27; margin: 15px 0 0;">CONGRATULATIONS!</h1>
          <p style="color: #0a0e27; font-weight: 600;">You are a WINNER!</p>
        </div>
        <div class="content" style="padding: 45px;">
          <h3 style="background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Dear ${userData.fullName},</h3>
          
          <p style="color: #FFD700; font-size: 20px; text-align: center; margin: 25px 0; font-weight: 700;">🎉 You have won the ${awardCategory} Award! 🎉</p>
          
          <div style="background: rgba(212, 175, 55, 0.1); padding: 25px; border-radius: 16px; margin: 25px 0;">
            <h4 style="color: #D4AF37;">📅 Award Ceremony Invitation</h4>
            <p style="color: #a0a0c0;">You are cordially invited to the Grand Award Ceremony:</p>
            <p style="color: #a0a0c0;"><strong style="color: #D4AF37;">Date:</strong> Coming Soon<br>
            <strong style="color: #D4AF37;">Venue:</strong> New Delhi<br>
            <strong style="color: #D4AF37;">Dress Code:</strong> Formal/Black Tie</p>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="https://beea.in/register-ceremony" style="background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%); color: #0a0e27; padding: 12px 35px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: 700; text-transform: uppercase;">Confirm Attendance</a>
          </div>
          
          <div style="background: rgba(212, 175, 55, 0.08); padding: 15px; border-radius: 12px; text-align: center;">
            <p style="color: #D4AF37; margin: 0;"><strong>📞 For ceremony details:</strong> ${CONTACT_INFO.phone}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await transporter.sendMail({
    from: `"BEEA Team" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: "🏆 CONGRATULATIONS! You're a WINNER at BEEA Awards!",
    html: template,
  });
};

// Main Phase 1 Email Sender
export const sendEmail = async (to, userData, verificationLink) => {
  try {
    const htmlContent = generatePhase1Template(userData, verificationLink);
    
    const mailOptions = {
      from: `"Bharat Education Excellence Awards" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: `✨ Phase 1: BEEA Nomination Received - ${userData.collegeName}`,
      html: htmlContent,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Phase 1 Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email failed:", error);
    throw new Error(`Email failed: ${error.message}`);
  }
};

// Contact Query Response
export const sendContactResponse = async (userEmail, userName, query) => {
  const template = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Poppins', Arial, sans-serif; background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0d1230 100%); margin: 0; padding: 0; }
        .container { max-width: 600px; margin: auto; background: rgba(13, 18, 48, 0.95); border-radius: 20px; padding: 45px; border: 1px solid rgba(212, 175, 55, 0.2); }
      </style>
    </head>
    <body style="background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0d1230 100%); padding: 40px 20px;">
      <div class="container">
        <h2 style="background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Thank you for contacting BEEA</h2>
        <p style="color: #a0a0c0;">Dear ${userName},</p>
        <p style="color: #a0a0c0;">We have received your query and will respond within 24-48 hours.</p>
        <div style="background: rgba(212, 175, 55, 0.1); padding: 20px; border-radius: 12px; margin: 25px 0;">
          <p style="color: #D4AF37;"><strong>Your Query:</strong></p>
          <p style="color: #a0a0c0;">${query}</p>
        </div>
        <p style="color: #a0a0c0;">For urgent assistance, please call: <strong style="color: #D4AF37;">${CONTACT_INFO.phone}</strong></p>
        <p style="color: #a0a0c0;">Best regards,<br>BEEA Support Team</p>
        <hr style="margin: 25px 0; border-color: rgba(212, 175, 55, 0.2);">
        <p style="color: #8888aa; font-size: 12px;">${CONTACT_INFO.email} | ${CONTACT_INFO.phone}</p>
      </div>
    </body>
    </html>
  `;
  
  await transporter.sendMail({
    from: `"BEEA Support" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "✨ We've received your query - BEEA Team",
    html: template,
  });
};

export { CONTACT_INFO };