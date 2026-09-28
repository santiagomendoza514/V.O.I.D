import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next bloquea por seguridad las peticiones a sus recursos de desarrollo que
  // no vengan de localhost. Al abrir el sitio desde otro equipo de la red local
  // —el teléfono, por ejemplo— el recargado en caliente deja de funcionar y sale
  // el aviso de "Blocked cross-origin request". Autorizar la IP de la máquina lo
  // resuelve. Solo aplica en desarrollo; en producción se ignora.
  allowedDevOrigins: ["192.168.2.7"],
};

export default nextConfig;
