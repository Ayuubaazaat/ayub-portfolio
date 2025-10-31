export default function handler(req, res) {
  console.log('=== ENVIRONMENT TEST ===');
  console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD);
  console.log('All env vars with ADMIN:', Object.keys(process.env).filter(key => key.includes('ADMIN')));
  console.log('========================');
  
  res.status(200).json({ 
    adminPassword: process.env.ADMIN_PASSWORD,
    allAdminVars: Object.keys(process.env).filter(key => key.includes('ADMIN'))
  });
}



