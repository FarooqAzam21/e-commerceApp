import React from 'react'
import { useEffect } from 'react';

export default function Botpress() {
    useEffect(() => {
    // Load inject.js
    const script1 = document.createElement('script');
    script1.src = 'https://cdn.botpress.cloud/webchat/v3.2/inject.js';
    script1.defer = true;
    document.body.appendChild(script1);

    // Load your bot config script
    const script2 = document.createElement('script');
    script2.src = 'https://files.bpcontent.cloud/2025/08/13/13/20250813131458-M9IIS9RU.js';
    script2.defer = true;
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);


  return (
    <></>
  )
}
