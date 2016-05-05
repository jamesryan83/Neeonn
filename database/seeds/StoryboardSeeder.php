<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Seeder;

class StoryboardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker\Factory::create();


        $categories = array("Uncategorized", "Action", "Adventure", "Adult", "Animals", "Apparel", "Art", "Articles", "Autobiography", "Beauty", "Biography", "Bizzare", "Business", "Cars", "Children", "Computers", "Design", "Education", "Electronics", "Entertainment", "Fantasy", "Film", "Finance", "Fitness", "Food", "Funny", "Games", "General", "Health", "History", "Home and Garden", "Horror", "Internet", "Journals", "Music", "Mystery", "News", "Outdoors", "Pets", "Photography", "Poetry", "Politics", "Real Estate", "Religion", "Restaurants", "Romance", "Science", "Science Fiction", "Social", "Spirituality", "Sports", "Technology", "Television", "Travel", "Tutorial", "Video Games", "Weddings", "Writing");



        for ($i = 0; $i < 100; $i++) {
            Log::info($faker->biasedNumberBetween($min = 0, $max = 1, $function = "sqrt"));
        }

//        DB::table("storyboards")->insert([
//            "user_id" => $faker->numberBetween($min = 5, $max = 9),
//            "title" => $faker->text($maxNbChars = 70),
//            "category" => $faker->randomElement($array = $categories),
//        ]);
    }
}
