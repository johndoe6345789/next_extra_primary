/**
 * @file test_review_validation.cpp
 * @brief Validation rules for the review write API
 *        (rating range + body length checks).
 *
 * The helpers under test are header-only inline funcs
 * in shop_review_helpers.h; they take a nlohmann::json
 * value and return a bool — pure and DB-free.
 */

#include "ecommerce/controllers/shop_review_validation.h"

#include <gtest/gtest.h>
#include <nlohmann/json.hpp>
#include <string>

using nlohmann::json;
using controllers::shop::validBody;
using controllers::shop::validRating;

TEST(ReviewValidation, RatingAcceptsOneToFive)
{
    for (int i = 1; i <= 5; ++i)
        EXPECT_TRUE(validRating(json(i))) << "i=" << i;
}

TEST(ReviewValidation, RatingRejectsOutOfRange)
{
    EXPECT_FALSE(validRating(json(0)));
    EXPECT_FALSE(validRating(json(6)));
    EXPECT_FALSE(validRating(json(-1)));
}

TEST(ReviewValidation, RatingRejectsNonInt)
{
    EXPECT_FALSE(validRating(json("3")));
    EXPECT_FALSE(validRating(json(3.5)));
    EXPECT_FALSE(validRating(json(nullptr)));
    EXPECT_FALSE(validRating(json::object()));
}

TEST(ReviewValidation, BodyAcceptsNormal)
{
    EXPECT_TRUE(validBody(json("Great product!")));
    EXPECT_TRUE(validBody(json("a")));
}

TEST(ReviewValidation, BodyRejectsEmpty)
{
    EXPECT_FALSE(validBody(json("")));
}

TEST(ReviewValidation, BodyRejectsTooLong)
{
    std::string huge(5001, 'x');
    EXPECT_FALSE(validBody(json(huge)));
}

TEST(ReviewValidation, BodyAcceptsMaxLen)
{
    std::string max(5000, 'x');
    EXPECT_TRUE(validBody(json(max)));
}

TEST(ReviewValidation, BodyRejectsNonString)
{
    EXPECT_FALSE(validBody(json(42)));
    EXPECT_FALSE(validBody(json(nullptr)));
    EXPECT_FALSE(validBody(json::array()));
}
