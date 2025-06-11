package com.rnnetworkexperimental

import com.facebook.react.modules.network.CookieJarContainer
import okhttp3.Cookie
import okhttp3.Dns
import okhttp3.HttpUrl
import okhttp3.OkHttpClient
import java.net.Inet4Address
import java.net.InetAddress

class DnsSelector() : Dns {
    override fun lookup(hostname: String): List<InetAddress> {
        return Dns.SYSTEM.lookup(hostname).filter { Inet4Address::class.java.isInstance(it) }
    }
}

object CustomOkHttpClient {
    fun getClient(): OkHttpClient {
        // Кастомная реализация CookieJarContainer
        val cookieJarContainer = object : CookieJarContainer {
            private var cookieJar: okhttp3.CookieJar? = null

            override fun setCookieJar(cookieJar: okhttp3.CookieJar?) {
                this.cookieJar = cookieJar
            }

            override fun removeCookieJar() {
                this.cookieJar = null
            }

            override fun saveFromResponse(url: HttpUrl, cookies: List<Cookie>) {
                // Минимальная реализация: передаём управление внутреннему CookieJar, если он установлен
                cookieJar?.saveFromResponse(url, cookies)
            }

            override fun loadForRequest(url: HttpUrl): List<Cookie> {
                // Минимальная реализация: возвращаем cookies из внутреннего CookieJar, если он установлен
                return cookieJar?.loadForRequest(url) ?: emptyList()
            }
        }

        return OkHttpClient.Builder()
            .cookieJar(cookieJarContainer)
            .dns(DnsSelector())
            .build()
    }
}