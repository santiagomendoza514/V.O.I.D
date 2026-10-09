# Acceso y navegación

Cómo funcionan el registro, el inicio de sesión, el captcha, los enlaces del landing y el Dock — y qué te falta configurar a ti.

**El orden importa.** La sección 1.4 hay que hacerla **antes** de probar el registro, o los correos de confirmación van a apuntar a un sitio equivocado. La 1.6 (Turnstile) tiene su propio orden, y si lo inviertes nadie puede entrar.

---

## 1. Registro e inicio de sesión

### 1.1 Qué hay y cómo fluye

| Ruta | Qué hace |
|---|---|
| `/entrar` | Pestañas **Entrar** y **Crear cuenta**. `/entrar?modo=registro` abre directo la segunda. |
| `/auth/confirmar` | Recibe el clic del correo de confirmación, inicia la sesión y manda a `/cuenta`. |
| `/cuenta` | Tu cuenta. Sin sesión, manda a `/entrar` y, al entrar, regresa aquí. |

El recorrido de una persona nueva:

1. Llena nombre, correo y contraseña, y planta la semilla.
2. Supabase crea la cuenta y le envía un correo de confirmación.
3. Ve "Revisa tu correo".
4. Abre el enlace del correo → `/auth/confirmar` → queda con sesión → `/cuenta`, con "Tu correo quedó confirmado".

Los archivos:

- `src/app/entrar/acciones.ts` — las acciones del servidor `entrar` y `registrarse`. Hablan con Supabase y traducen sus errores, que llegan en inglés, a mensajes en español.
- `src/components/acceso/FormularioAcceso.tsx` — las pestañas y los dos formularios.
- `src/components/acceso/PlantaSemilla.tsx` — el minijuego.
- `src/components/acceso/Turnstile.tsx` — la protección real contra bots.
- `src/app/auth/confirmar/route.ts` — el destino del enlace del correo.
- `src/app/cuenta/` — la página de cuenta y el cierre de sesión.

### 1.2 Por qué el formulario usa acciones del servidor

Las acciones (`'use server'`) corren en el servidor, no en el navegador. Así, la sesión se guarda en una cookie que el servidor controla, y la lógica de acceso nunca se descarga al teléfono de nadie.

Tres decisiones de seguridad que conviene conocer:

- **`/entrar?siguiente=...` solo acepta rutas internas.** Si aceptara cualquier valor, alguien podría mandar a tus clientes un enlace como `/entrar?siguiente=https://sitio-falso.com`: entrarían de verdad a V.O.I.D y, un segundo después, terminarían en otra página. Se llama *redirección abierta* y es un clásico del phishing.
- **El registro nunca confirma si un correo ya tiene cuenta.** Si alguien se registra con un correo existente, Supabase responde igual que si fuera nuevo y no envía nada. Así nadie puede averiguar quién es cliente tuyo probando correos en el formulario.
- **`/cuenta` usa `getUser()`, nunca `getSession()`.** Ver la sección 7 de `supabase.md`.

### 1.3 El captcha: dos capas, y por qué

**Un minijuego, por sí solo, no frena bots.** El registro habla con Supabase usando la llave pública, que viaja en el navegador. Un bot puede ignorar tu página por completo y registrarse llamando directamente a Supabase, sin ver nunca el juego.

La única protección real es la que verifica **Supabase en su servidor**, y Supabase solo admite dos proveedores: hCaptcha o **Cloudflare Turnstile**. Por eso hay dos capas:

| Capa | Qué es | Protege |
|---|---|---|
| **Turnstile** | Casi siempre invisible: Cloudflare evalúa el navegador en segundo plano y solo muestra algo si duda. | **Sí.** Supabase rechaza el registro si el token no es válido. |
| **Planta la semilla** | El momento de marca que ve la persona. | No. Es experiencia, no seguridad. |

Mientras no actives Turnstile (sección 1.6), **el registro no tiene protección contra bots**. El juego se ve y funciona igual, pero no frena a nadie que sepa saltárselo.

#### El minijuego

Mūlādhāra es tierra, y *Bīja* —una de tus prendas— significa semilla. Se arrastra la semilla hasta el hueco, se suelta, cae; si acierta, germina. El hueco cambia de sitio en cada visita.

- Solo está en **Crear cuenta**. Ponerlo en cada inicio de sesión cansaría justo a quienes más vuelven. Al entrar solo actúa Turnstile, que es invisible.
- Se mueve en **una sola dimensión**, a propósito: arrastrar de lado funciona igual con el dedo que con el mouse, y se traduce limpio a teclado — **flechas** para mover, **Enter** para soltar. Un juego que solo se puede arrastrar excluye a quien no usa mouse.
- Un lector de pantalla anuncia cuándo la semilla está sobre el hueco.

### 1.4 Configurar Supabase — obligatorio antes de probar

Panel de Supabase → **Authentication** → **URL Configuration**:

- **Site URL**: `https://void-web-lovat.vercel.app`
- **Redirect URLs**, agrega estas tres:
  ```
  http://localhost:3000/**
  https://void-web-lovat.vercel.app/**
  https://*-void-5c2f.vercel.app/**
  ```

**Por qué es obligatorio:** el correo de confirmación lleva un enlace de vuelta a `/auth/confirmar`. Supabase solo permite volver a direcciones de esta lista; si no está, usa la Site URL — que en un proyecto nuevo viene como `http://localhost:3000`. Sin este paso, tus clientes recibirían un enlace que apunta a su propio computador y no abre nada.

La tercera línea cubre las URLs de prueba que Vercel genera para cada rama.

### 1.5 Correos: quién puede registrarse hoy

El servidor de correo que trae Supabase es solo para pruebas, y **solo envía correos a los miembros de tu organización en Supabase**. Hoy, eso significa que **solo tú puedes completar un registro**. Cualquier otra persona se registraría, pero el correo de confirmación nunca le llegaría y no podría entrar.

Para probar, usa tu propio correo. Antes de abrir el sitio, hay que configurar un servidor de correo propio — sección 8 de `supabase.md`. Verifica en el panel la condición vigente: Supabase la muestra como aviso en la configuración de correo.

### 1.6 Activar Turnstile — antes de abrir el sitio

**En este orden exacto.** Si activas el paso 3 antes de que el 2 esté publicado, Supabase empieza a exigir un token que el sitio todavía no manda, y **nadie puede ni entrar ni registrarse**.

**Paso 1 — Crear el widget en Cloudflare.**
Crea una cuenta en Cloudflare → **Turnstile** → **Add widget**.
- Hostnames: `void-web-lovat.vercel.app` y `localhost`
- Widget mode: **Managed**

Te da dos llaves: la **Site Key** (pública) y la **Secret Key** (secreta).

**Paso 2 — La Site Key en el sitio.**
En `void-web/.env.local`:
```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=tu-site-key
```
Y en Vercel, desde la raíz del repositorio:
```bash
npx vercel env add NEXT_PUBLIC_TURNSTILE_SITE_KEY production
```
```bash
npx vercel env add NEXT_PUBLIC_TURNSTILE_SITE_KEY preview
```
Haz push y espera a que el despliegue quede listo.

**Paso 3 — La Secret Key en Supabase.**
Panel de Supabase → **Authentication** → **Attack Protection** (puede aparecer como *Bot and Abuse Protection*) → **Enable CAPTCHA protection** → proveedor **Turnstile** → pega la **Secret Key**.

La Secret Key va **solo** en Supabase. No va en `.env.local`, ni en Vercel, ni en el código.

**Qué pasa si Cloudflare no carga** (un bloqueador de anuncios, por ejemplo): el botón no se queda bloqueado. Se libera, y si Supabase exige el token, la persona ve "No pudimos verificar que eres una persona". Un mensaje claro es mejor que un botón muerto sin explicación.

### 1.7 Guardar el nombre en el perfil

El nombre que se escribe al registrarse se guarda en la cuenta de Supabase, y `/cuenta` ya lo muestra. Pero la tabla `perfiles` todavía no lo copia, porque el trigger de la sección 3.1 de `supabase.md` solo guarda el `id`. Para que también quede ahí, corre esto en el **SQL Editor**:

```sql
create or replace function public.crear_perfil()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.perfiles (id, nombre)
  values (new.id, nullif(trim(new.raw_user_meta_data ->> 'nombre'), ''));
  return new;
end;
$$;
```

Solo afecta a las cuentas que se creen de aquí en adelante.

### 1.8 Probarlo

1. Haz la sección **1.4**.
2. `npm run dev` y abre `http://localhost:3000/entrar?modo=registro`.
3. Regístrate **con tu correo** (ver 1.5) y planta la semilla.
4. Debe aparecer "Revisa tu correo". Abre el enlace del correo.
5. Debes llegar a `/cuenta` con "Tu correo quedó confirmado".
6. **Cerrar sesión** te lleva al inicio. Entra de nuevo desde `/entrar`.

Ahora puedes hacer la sección 3.8 de `supabase.md` registrándote aquí, en vez de crear la cuenta desde el panel.

### 1.9 Antes de abrir el registro al público: datos personales

El registro recoge nombre y correo. En Colombia, la **Ley 1581 de 2012** exige una autorización expresa para tratar datos personales y una política de tratamiento publicada. El footer ya tiene el enlace "Política de privacidad", pero no lleva a ninguna página. Hay que redactarla —idealmente con asesoría legal— y agregar al registro la casilla de autorización **antes** de que se registre gente real.

---

## 2. Los enlaces del landing

### 2.1 Los filtros pasaron a la URL

Los menús de categorías apuntan justamente a los filtros que ya tiene la colección: Tops, Frío, Tote bags. Pero los filtros vivían solo en la memoria de la página, así que un enlace no podía activarlos. Ahora viven en la URL:

```
/colecciones/muladhara?tipo=saco,hoodie
/colecciones/muladhara?clima=frio
/colecciones/muladhara?talla=M&color=negro
```

Esto deja tres cosas resueltas a la vez:

- Un enlace del menú abre la colección **ya filtrada**.
- **Recargar** la página ya no borra los filtros.
- Una búsqueda se puede **compartir**: copias la URL y la otra persona ve lo mismo.

La URL es la única fuente de verdad. Si estás en la colección y eliges otra categoría desde el menú del encabezado, los filtros cambian sin recargar. Y si una URL trae valores que no existen, se ignoran: un enlace viejo nunca rompe la página.

**Un detalle técnico que no hay que tocar:** en `src/app/colecciones/[slug]/page.tsx`, la colección va dentro de un `<Suspense>`. Leer la URL solo es posible en el navegador; sin esa frontera, Next dejaría de pre-renderizar la página entera y perdería su regeneración por minuto.

### 2.2 Dónde viven los destinos

Todo en `src/lib/enlaces.ts`:

- **`COLECCION_ACTIVA`** — la colección a la venta. Cuando lances Svādhiṣṭhāna, la cambias ahí y todos los "comprar" del sitio apuntan a la nueva.
- **`PARTES`** — qué prendas son Tops, Bottoms y Accesorios.
- **`enlaceColeccion()`** — arma la URL filtrada.

Está en un archivo aparte a propósito: los menús viven en el encabezado de todas las páginas, e importar ahí el catálogo completo cargaría las once prendas en cada visita.

### 2.3 Mapa de enlaces

**Encabezado**

| Enlace | Destino |
|---|---|
| shop all | `/colecciones/muladhara` |
| categories | `/colecciones/muladhara` — en pantallas táctiles no hay hover para abrir el menú; sin destino propio, tocarlo no haría nada |
| Menú plus → Colecciones | `/colecciones` |
| Menú plus → Mūlādhāra | `/colecciones/muladhara` |
| Menú plus → Svādhiṣṭhāna, Maṇipūra | No navegan: son colecciones futuras |

**Menú Categorías y tarjetas giratorias**

| Enlace | Destino |
|---|---|
| Tops / View All | `?tipo=chaqueta,camiseta,saco,hoodie` |
| Bottoms / View All | `?tipo=pantalon,sudadera` |
| Chaquetas, Sacos, Hoodies, Camisetas, Sudaderas, Pantalones | su tipo |
| Frío, Templado, Cálido | su clima |
| Tote Bags, Bolsos | `?tipo=tote` |
| Rompevientos, Jorts, Gorras, Boinas, Coming soon… | "Próximamente": se ven, pero no llevan a una colección vacía |

### 2.4 Lo que no se pudo enlazar

- **"Caluroso"** — el catálogo clasifica en frío, templado, cálido y lluvia, así que "Caluroso" no tiene equivalente y por ahora lleva a lo mismo que "Cálido". Te sugiero cambiarlo por **Lluvia**, que sí existe en los datos.
- **Footer** — About us, Contacto, Preguntas frecuentes y las cinco políticas no tienen página todavía.
- **Redes sociales** — Instagram, YouTube, WhatsApp y TikTok necesitan las URLs de tus cuentas.

---

## 3. El Dock

El ítem **Cuenta** lleva siempre a `/cuenta`:

- Con sesión, muestra la cuenta.
- Sin sesión, `/cuenta` manda a `/entrar?siguiente=/cuenta`, y al entrar la persona regresa a su cuenta.

Así el Dock no necesita saber si hay alguien con sesión: la página decide. Es más simple y no se desincroniza.

El Dock es un componente de React Bits que solo acepta `onClick` — sus ítems son botones, no enlaces —, así que navega con el router de Next.

Los otros tres ítems —Buscar, Favoritos y Carrito— todavía muestran un `alert()` de prueba ("Home!", "Archive!", "Profile!"). **Eso está en el sitio publicado**: cualquier visitante que los toque ve esa ventana.
