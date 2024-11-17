import { createTransport } from 'nodemailer';
import { render } from '@react-email/render';
import { ProjectNotification } from '@/emails/ProjectNotification';

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendProjectNotification(
  to: string,
  project: {
    name: string;
    description: string;
    author: string;
    url: string;
  }
) {
  const html = render(ProjectNotification({ project }));

  await transporter.sendMail({
    from: '"ELIZAS LIST" <notifications@elizaslist.dev>',
    to,
    subject: `New Project: ${project.name}`,
    html,
  });
} 