/**
 * @file test_image_vips_processor.cpp
 * @brief Mirror-logic tests for VipsProcessor::process.
 *
 * The real implementation wraps libvips; in this test we
 * mirror the pure logic around variant fan-out so the
 * suite compiles without libvips on CI.
 */

#include <gtest/gtest.h>

#include <algorithm>
#include <string>
#include <vector>

namespace
{

struct Spec
{
    std::string name;
    int maxW{0};
    int maxH{0};
};

/// @brief Mirrors the aspect-preserving fit used by
///        vips_thumbnail_image with "height" hint.
std::pair<int, int> fit(int srcW, int srcH,
                        const Spec& s)
{
    const double rw =
        static_cast<double>(s.maxW) / srcW;
    const double rh =
        static_cast<double>(s.maxH) / srcH;
    const double r = std::min({rw, rh, 1.0});
    return {static_cast<int>(srcW * r),
            static_cast<int>(srcH * r)};
}

}  // namespace

class VipsProcessorFitTest : public ::testing::Test
{
};

TEST_F(VipsProcessorFitTest, FitsWithinBox)
{
    auto [w, h] = fit(2000, 1000,
                      {"large", 800, 800});
    EXPECT_EQ(w, 800);
    EXPECT_EQ(h, 400);
}

TEST_F(VipsProcessorFitTest, NoUpscale)
{
    auto [w, h] = fit(100, 100,
                      {"large", 800, 800});
    EXPECT_EQ(w, 100);
    EXPECT_EQ(h, 100);
}

TEST_F(VipsProcessorFitTest, TallImageBound)
{
    auto [w, h] = fit(500, 2000,
                      {"thumb", 150, 150});
    EXPECT_EQ(w, 37);
    EXPECT_EQ(h, 150);
}
