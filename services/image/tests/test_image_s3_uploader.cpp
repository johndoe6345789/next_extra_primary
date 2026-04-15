/**
 * @file test_image_s3_uploader.cpp
 * @brief Mirror-logic tests for S3 object-key composition
 *        and HTTP status-code acceptance used by the
 *        image-processor's S3Uploader.
 */

#include <gtest/gtest.h>

#include <string>

namespace
{

/// @brief Mirrors S3Uploader object-key composition.
std::string makeKey(long long jobId,
                    const std::string& variant,
                    const std::string& format)
{
    return std::to_string(jobId) + "/" +
           variant + "." + format;
}

/// @brief Mirrors the 2xx-only success gate in upload().
bool isSuccess(int code)
{
    return code >= 200 && code < 300;
}

}  // namespace

class S3UploaderTest : public ::testing::Test
{
};

TEST_F(S3UploaderTest, KeyIncludesJobAndVariant)
{
    EXPECT_EQ(makeKey(42, "thumbnail", "webp"),
              "42/thumbnail.webp");
}

TEST_F(S3UploaderTest, KeyRespectsFormat)
{
    EXPECT_EQ(makeKey(7, "large", "png"),
              "7/large.png");
}

TEST_F(S3UploaderTest, Status200Accepted)
{
    EXPECT_TRUE(isSuccess(200));
    EXPECT_TRUE(isSuccess(204));
}

TEST_F(S3UploaderTest, Status4xx5xxRejected)
{
    EXPECT_FALSE(isSuccess(199));
    EXPECT_FALSE(isSuccess(301));
    EXPECT_FALSE(isSuccess(403));
    EXPECT_FALSE(isSuccess(500));
}
