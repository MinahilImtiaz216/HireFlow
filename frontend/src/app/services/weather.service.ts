import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, switchMap, catchError, of } from 'rxjs';

export interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  city: string;
  humidity: number;
  windSpeed: number;
  updatedAt: Date;
  timezone: string;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  constructor(private http: HttpClient) {}

  getWeather(): Observable<WeatherData | null> {
    return from(this.getCoords()).pipe(
      switchMap(({ lat, lon, city }) =>
        this.http.get<any>(
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,apparent_temperature,weathercode,relative_humidity_2m,wind_speed_10m` +
          `&timezone=auto`
        ).pipe(
          switchMap(res => {
            const c = res.current;
            return of<WeatherData>({
              temp: Math.round(c.temperature_2m),
              feelsLike: Math.round(c.apparent_temperature),
              description: this.codeToDesc(c.weathercode),
              icon: this.codeToIcon(c.weathercode),
              city,
              humidity: c.relative_humidity_2m,
              windSpeed: Math.round(c.wind_speed_10m),
              updatedAt: new Date(),
              timezone: res.timezone ?? 'Asia/Karachi'
            });
          }),
          catchError(() => of(null))
        )
      ),
      catchError(() => of(null))
    );
  }

  private getCoords(): Promise<{ lat: number; lon: number; city: string }> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ lat: 33.72, lon: 73.04, city: 'Islamabad' });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const city = await this.reverseGeocode(lat, lon);
          resolve({ lat, lon, city });
        },
        () => resolve({ lat: 33.72, lon: 73.04, city: 'Islamabad' }),
        { timeout: 6000, maximumAge: 300000 }
      );
    });
  }

  private async reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      const data = await res.json();
      return data.city || data.locality || data.principalSubdivision || 'Your City';
    } catch {
      return 'Your City';
    }
  }

  private codeToDesc(code: number): string {
    if (code === 0) return 'Clear Sky';
    if (code <= 2) return 'Partly Cloudy';
    if (code === 3) return 'Overcast';
    if (code <= 49) return 'Foggy';
    if (code <= 59) return 'Drizzle';
    if (code <= 69) return 'Rain';
    if (code <= 79) return 'Snow';
    if (code <= 99) return 'Thunderstorm';
    return 'Unknown';
  }

  private codeToIcon(code: number): string {
    if (code === 0) return '☀️';
    if (code <= 2) return '⛅';
    if (code === 3) return '☁️';
    if (code <= 49) return '🌫️';
    if (code <= 59) return '🌦️';
    if (code <= 69) return '🌧️';
    if (code <= 79) return '❄️';
    if (code <= 99) return '⛈️';
    return '🌡️';
  }
}
