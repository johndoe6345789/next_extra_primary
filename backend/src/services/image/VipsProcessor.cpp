/**
 * @file VipsProcessor.cpp
 * @brief libvips wrapper implementation (stubs without vips).
 */

#include "services/image/VipsProcessor.h"

#include <spdlog/spdlog.h>

#ifdef NEXTRA_HAVE_VIPS
#include <vips/vips.h>
#endif

namespace nextra::image
{

VipsProcessor::VipsProcessor() { ensureInit(); }
VipsProcessor::~VipsProcessor() = default;

bool VipsProcessor::ensureInit()
{
#ifdef NEXTRA_HAVE_VIPS
    static bool ready = [] {
        return vips_init("nextra-image") == 0;
    }();
    return ready;
#else
    return false;
#endif
}

#ifdef NEXTRA_HAVE_VIPS
static bool encode(VipsImage* img, const VariantSpec& s,
                   void** buf, std::size_t* len)
{
    if (s.format == "jpeg" || s.format == "jpg")
        return vips_jpegsave_buffer(
            img, buf, len, "Q", s.quality, nullptr) == 0;
    if (s.format == "png")
        return vips_pngsave_buffer(
            img, buf, len, nullptr) == 0;
    return vips_webpsave_buffer(
        img, buf, len, "Q", s.quality, nullptr) == 0;
}
#endif

ProcessingResult VipsProcessor::process(
    const unsigned char* src,
    std::size_t srcLen,
    const VariantSpec& spec)
{
    ProcessingResult r;
    r.variant.name = spec.name;
    r.variant.format = spec.format;
#ifdef NEXTRA_HAVE_VIPS
    VipsImage* in = vips_image_new_from_buffer(
        src, srcLen, "", nullptr);
    if (!in) { r.error = "decode failed"; return r; }
    VipsImage* out = nullptr;
    if (vips_thumbnail_image(
            in, &out, spec.maxWidth,
            "height", spec.maxHeight, nullptr) != 0)
    {
        g_object_unref(in);
        r.error = "thumbnail failed";
        return r;
    }
    void* buf = nullptr; std::size_t len = 0;
    if (!encode(out, spec, &buf, &len))
    {
        g_object_unref(out); g_object_unref(in);
        r.error = "encode failed";
        return r;
    }
    r.variant.width = vips_image_get_width(out);
    r.variant.height = vips_image_get_height(out);
    r.variant.bytes.assign(
        static_cast<unsigned char*>(buf),
        static_cast<unsigned char*>(buf) + len);
    g_free(buf);
    g_object_unref(out); g_object_unref(in);
    r.ok = true;
    return r;
#else
    (void)src; (void)srcLen;
    r.error = "vips not available";
    spdlog::debug("VipsProcessor stub: {}", spec.name);
    return r;
#endif
}

}  // namespace nextra::image
