"use client";

import { useEffect, useState } from "react";
import { MainLanding } from "@/components/MainLanding";
import { TenantLanding } from "@/components/TenantLanding";

export default function Home() {
  const [isTenant, setIsTenant] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Basic logic: If hostname has a subdomain and it's not 'www', treat as tenant
    // For localhost, we treat 'demo.localhost' or any 'xyz.localhost' as tenant
    const hostname = window.location.hostname;

    // Check for localhost subdomain
    const isLocalhostSubdomain = hostname.endsWith(".localhost") && hostname !== "localhost";

    // Check for production subdomain (assuming main domain is projectmizan.org or similar)
    // Adjust this logic based on your actual production domain structure
    const isProductionSubdomain = hostname.split('.').length > 2 && !hostname.startsWith('www');

    if (isLocalhostSubdomain || isProductionSubdomain) {
      setIsTenant(true);
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return isTenant ? <TenantLanding /> : <MainLanding />;
}
