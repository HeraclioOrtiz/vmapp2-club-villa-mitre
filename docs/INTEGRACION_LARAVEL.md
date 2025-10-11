# INTEGRACIÓN VILLA MITRE APP CON LARAVEL

## Documentación Técnica para Backend

---

## 🔐 AUTENTICACIÓN - LOGIN

### **Request (Frontend → Laravel)**
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "santiago@email.com",
  "password": "micontraseña123"
}
```

### **Response Exitoso (Laravel → Frontend)**
```json
HTTP 200 OK
Content-Type: application/json

{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "nombre": "Santiago",
      "apellido": "García", 
      "dni": "12345678",
      "email": "santiago@email.com",
      "foto_url": "https://api.clubvillamitre.com/storage/fotos/usuarios/1.jpg",
      "nro_socio": "001234",
      "valido_hasta": "2024-12-31",
      "codigo_barras": "123456789012",
      "estado_cuenta": {
        "al_dia": true,
        "cuotas_adeudadas": 0,
        "monto_adeudado": 0.00,
        "proximo_vencimiento": "2024-02-15",
        "ultimo_pago": "2024-01-15",
        "monto_ultimo_pago": 15000.00,
        "historial_pagos": [
          {
            "id": "1",
            "fecha": "2024-01-15",
            "monto": 15000.00,
            "concepto": "Cuota mensual enero",
            "metodo_pago": "Transferencia"
          }
        ]
      }
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE2NDA5OTUyMDAsImV4cCI6MTY0MDk5ODgwMCwibmJmIjoxNjQwOTk1MjAwLCJqdGkiOiJkZmYxMmVmZi0yZjNhLTRhYjMtOGE4Yi0yYzNkNGY1NjdlNzAiLCJzdWIiOjEsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.kJSWnuOb09Ch5L4YHBcKlhiYJU_TpwMZHQCdCVkI-Qs"
  },
  "message": "Login exitoso"
}
```

### **Response de Error**
```json
HTTP 401 Unauthorized
Content-Type: application/json

{
  "success": false,
  "message": "Credenciales inválidas",
  "errors": {
    "email": ["El email es requerido"],
    "password": ["La contraseña es requerida"]
  }
}
```

---

## 🎫 CARNET VIRTUAL

### **Request para obtener datos del carnet**
```json
GET /api/user/carnet
Authorization: Bearer {token}
Accept: application/json
```

### **Response**
```json
HTTP 200 OK
Content-Type: application/json

{
  "success": true,
  "data": {
    "id": "1",
    "nombre": "Santiago",
    "apellido": "García",
    "dni": "12345678",
    "nro_socio": "001234",
    "foto_url": "https://api.clubvillamitre.com/storage/fotos/usuarios/1.jpg",
    "valido_hasta": "2024-12-31",
    "codigo_barras": "123456789012",
    "estado_cuenta": {
      "al_dia": true,
      "cuotas_adeudadas": 0,
      "monto_adeudado": 0.00
    }
  }
}
```

---

## 🛠 ENDPOINTS LARAVEL REQUERIDOS

### **Rutas de API (routes/api.php)**
```php
<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

// Rutas de autenticación
Route::group(['prefix' => 'auth'], function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::get('user', [AuthController::class, 'user'])->middleware('auth:api');
});

// Rutas protegidas
Route::group(['middleware' => 'auth:api'], function () {
    Route::get('user/carnet', [UserController::class, 'getCarnet']);
});
```

### **Controlador de Autenticación (AuthController.php)**
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6'
        ]);

        if (!$token = auth()->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales inválidas'
            ], 401);
        }

        $user = auth()->user();
        $user->load('estadoCuenta.historialPagos');

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => (string) $user->id,
                    'nombre' => $user->nombre,
                    'apellido' => $user->apellido,
                    'dni' => $user->dni,
                    'email' => $user->email,
                    'foto_url' => $user->foto_url,
                    'nro_socio' => $user->nro_socio,
                    'valido_hasta' => $user->valido_hasta,
                    'codigo_barras' => $user->codigo_barras,
                    'estado_cuenta' => [
                        'al_dia' => $user->estadoCuenta->al_dia,
                        'cuotas_adeudadas' => $user->estadoCuenta->cuotas_adeudadas,
                        'monto_adeudado' => (float) $user->estadoCuenta->monto_adeudado,
                        'proximo_vencimiento' => $user->estadoCuenta->proximo_vencimiento,
                        'ultimo_pago' => $user->estadoCuenta->ultimo_pago,
                        'monto_ultimo_pago' => (float) $user->estadoCuenta->monto_ultimo_pago,
                        'historial_pagos' => $user->estadoCuenta->historialPagos->map(function ($pago) {
                            return [
                                'id' => (string) $pago->id,
                                'fecha' => $pago->fecha,
                                'monto' => (float) $pago->monto,
                                'concepto' => $pago->concepto,
                                'metodo_pago' => $pago->metodo_pago
                            ];
                        })
                    ]
                ],
                'token' => $token
            ],
            'message' => 'Login exitoso'
        ]);
    }

    public function logout()
    {
        auth()->logout();
        return response()->json([
            'success' => true,
            'message' => 'Logout exitoso'
        ]);
    }

    public function user()
    {
        return response()->json([
            'success' => true,
            'data' => auth()->user()
        ]);
    }
}
```

---

## 🗄 ESTRUCTURA DE BASE DE DATOS

### **Migración: users**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('apellido');
            $table->string('dni')->unique();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('foto_url')->nullable();
            $table->string('nro_socio')->unique();
            $table->date('valido_hasta');
            $table->string('codigo_barras')->unique();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
}
```

### **Migración: estado_cuenta**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEstadoCuentaTable extends Migration
{
    public function up()
    {
        Schema::create('estado_cuenta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->boolean('al_dia')->default(true);
            $table->integer('cuotas_adeudadas')->default(0);
            $table->decimal('monto_adeudado', 10, 2)->default(0);
            $table->date('proximo_vencimiento')->nullable();
            $table->date('ultimo_pago')->nullable();
            $table->decimal('monto_ultimo_pago', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('estado_cuenta');
    }
}
```

### **Migración: historial_pagos**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHistorialPagosTable extends Migration
{
    public function up()
    {
        Schema::create('historial_pagos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('estado_cuenta_id')->constrained()->onDelete('cascade');
            $table->date('fecha');
            $table->decimal('monto', 10, 2);
            $table->string('concepto');
            $table->string('metodo_pago');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('historial_pagos');
    }
}
```

---

## 📋 DATOS DE PRUEBA

### **Usuario de Prueba para Login**
```json
{
  "email": "santi@clubvillamitre.com",
  "password": "password123"
}
```

### **Seeder para datos de prueba**
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\EstadoCuenta;
use App\Models\HistorialPago;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        $user = User::create([
            'nombre' => 'Santi',
            'apellido' => 'García',
            'dni' => '12345678',
            'email' => 'santi@clubvillamitre.com',
            'password' => Hash::make('password123'),
            'foto_url' => 'https://api.clubvillamitre.com/storage/fotos/usuarios/santi.jpg',
            'nro_socio' => '001234',
            'valido_hasta' => '2024-12-31',
            'codigo_barras' => '123456789012'
        ]);

        $estadoCuenta = EstadoCuenta::create([
            'user_id' => $user->id,
            'al_dia' => true,
            'cuotas_adeudadas' => 0,
            'monto_adeudado' => 0.00,
            'proximo_vencimiento' => '2024-02-15',
            'ultimo_pago' => '2024-01-15',
            'monto_ultimo_pago' => 15000.00
        ]);

        HistorialPago::create([
            'estado_cuenta_id' => $estadoCuenta->id,
            'fecha' => '2024-01-15',
            'monto' => 15000.00,
            'concepto' => 'Cuota mensual enero',
            'metodo_pago' => 'Transferencia'
        ]);
    }
}
```

---

## 🔧 CONFIGURACIÓN REQUERIDA

### **Headers HTTP**
```
Content-Type: application/json
Authorization: Bearer {token}
Accept: application/json
```

### **Validaciones Laravel**
- **Email**: required, email, exists:users,email
- **Password**: required, min:6

### **JWT Configuration**
```bash
composer require tymon/jwt-auth
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret
```

---

## 📱 INTEGRACIÓN CON REACT NATIVE

### **Configuración de API Base URL**
```typescript
// src/config/api.ts
export const API_BASE_URL = 'https://api.clubvillamitre.com/api';
```

### **Servicio de Autenticación**
```typescript
// src/services/authService.ts
import { LoginRequest, LoginResponse } from '../types';

const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(credentials)
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Error de login');
  }
  
  return data.data;
};
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] Configurar JWT en Laravel
- [ ] Crear migraciones de base de datos
- [ ] Implementar AuthController
- [ ] Implementar UserController
- [ ] Configurar rutas de API
- [ ] Crear seeders de datos de prueba
- [ ] Configurar CORS para React Native
- [ ] Implementar middleware de autenticación
- [ ] Configurar almacenamiento de archivos (fotos)
- [ ] Probar endpoints con Postman/Insomnia

---

**Fecha de creación**: 4 de septiembre de 2024  
**Versión**: 1.0  
**Proyecto**: Villa Mitre App - Integración Laravel
