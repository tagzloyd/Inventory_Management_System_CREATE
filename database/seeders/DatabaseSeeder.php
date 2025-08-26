<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        
        // Clear existing tables
        DB::table('users')->truncate();
        
        // Insert users directly
        DB::table('users')->insert([
            [
                'name' => 'Admin',
                'email' => 'admin@carsu.edu.ph',
                'password' => Hash::make('Create-Admin'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Loyd N. Tagaro',
                'email' => 'loydtagaro1@gmail.com',
                'password' => Hash::make('Tagaro-07'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
};