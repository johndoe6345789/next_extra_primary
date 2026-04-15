/**
 * @file test_gallery_album_ordering.cpp
 * @brief Album ordering by position, stable on ties.
 */

#include <gtest/gtest.h>
#include <algorithm>
#include <string>
#include <vector>

namespace
{

struct Album
{
    std::string id;
    int position;
};

void sortAlbums(std::vector<Album>& v)
{
    std::stable_sort(v.begin(), v.end(),
                     [](const Album& a, const Album& b)
                     {
                         return a.position < b.position;
                     });
}

} // namespace

class GalleryOrderingTest : public ::testing::Test
{
};

TEST_F(GalleryOrderingTest, SortsByPosition)
{
    std::vector<Album> v = {{"a", 3}, {"b", 1}, {"c", 2}};
    sortAlbums(v);
    EXPECT_EQ(v[0].id, "b");
    EXPECT_EQ(v[1].id, "c");
    EXPECT_EQ(v[2].id, "a");
}

TEST_F(GalleryOrderingTest, StableOnTies)
{
    std::vector<Album> v = {
        {"a", 1}, {"b", 1}, {"c", 1}};
    sortAlbums(v);
    EXPECT_EQ(v[0].id, "a");
    EXPECT_EQ(v[1].id, "b");
    EXPECT_EQ(v[2].id, "c");
}

TEST_F(GalleryOrderingTest, EmptyOk)
{
    std::vector<Album> v;
    sortAlbums(v);
    EXPECT_TRUE(v.empty());
}
