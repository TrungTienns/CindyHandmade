import React, { useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import Contact from '../../layouts/Contact/Contact';

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <Contact />
    </MainLayout>
  );
};

export default ContactPage;
