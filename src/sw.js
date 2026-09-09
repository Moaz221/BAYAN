import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { NetworkFirst, NetworkOnly } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

const precacheManifest = self.__WB_MANIFEST.filter(
  ({ url }) => !new URL(url, self.location.origin).pathname.endsWith('/index.html'),
)

precacheAndRoute(precacheManifest)
cleanupOutdatedCaches()
clientsClaim()
self.addEventListener('install', () => self.skipWaiting())

const navigationStrategy = new NetworkFirst({
  cacheName: 'bayan-navigation',
  networkTimeoutSeconds: 10,
  plugins: [
    new ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 60 * 60,
    }),
  ],
})

registerRoute(new NavigationRoute(navigationStrategy))

const requestedSupabaseRestPattern =
  /^https:\/\/[a-z]+\.[a-z]+\/rest\/v1\/.*/i
const supabaseProjectRestPattern =
  /^https:\/\/[a-z0-9-]+\.supabase\.co\/rest\/v1\/.*/i

registerRoute(requestedSupabaseRestPattern, new NetworkOnly(), 'GET')
registerRoute(supabaseProjectRestPattern, new NetworkOnly(), 'GET')

const removeLegacyCaches = async () => {
  const cacheNames = await caches.keys()

  await Promise.all(
    cacheNames.map(async (cacheName) => {
      const cache = await caches.open(cacheName)
      const requests = await cache.keys()

      await Promise.all(
        requests
          .filter((request) => {
            const pathname = new URL(request.url).pathname
            return pathname.endsWith('/index.html')
          })
          .map((request) => cache.delete(request)),
      )
    }),
  )

  await caches.delete('supabase-api-cache')
}

self.addEventListener('activate', (event) => {
  event.waitUntil(removeLegacyCaches())
})
