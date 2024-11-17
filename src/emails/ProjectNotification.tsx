import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Text,
} from '@react-email/components';

interface ProjectNotificationProps {
  project: {
    name: string;
    description: string;
    author: string;
    url: string;
  };
}

export function ProjectNotification({ project }: ProjectNotificationProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Project on ELIZA'S LIST</Heading>
          <Text style={text}>
            A new project has been added to ELIZA'S LIST:
          </Text>
          <Heading style={h2}>{project.name}</Heading>
          <Text style={text}>{project.description}</Text>
          <Text style={text}>
            By: {project.author}
          </Text>
          <Link href={project.url} style={button}>
            View Project
          </Link>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const h2 = {
  color: '#444',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '20px 0',
};

const text = {
  color: '#555',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '4px',
  color: '#fff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '12px 24px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  margin: '20px 0',
}; 