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
        // Clear existing users
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

        // Clear existing categories
        DB::table('categories')->truncate();
        // Insert categories directly
        DB::table('categories')->insert([
            [
                'name' => 'AB Power Engineering',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Renewable Energy for AB Applications',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'AB Machinery and Mechanization',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Machine Design for AB Production',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'AB Structures and Environment Engineering',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Plant and Livestock Environmental Engineering',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'AB Electrification and Control Systems',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'AB Waste Engineering',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Hydrometeorology',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Irrigation and Drainage Engineering',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Land and Water Conservation Engineering',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Aquaculture Engineering',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Properties of AB Materials',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'AB Products Processing and Storage',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Food Process Engineering',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Design and Management of AB Processing Systems',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Other Materials/ Equipments Available in DABE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
