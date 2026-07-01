#!/usr/bin/env bash
# Downloads original-resolution image assets from the current Wix site.
# These are the owner's own brand/facility assets, migrated to the new site.
set -uo pipefail

DEST="$(dirname "$0")/../public/images"
mkdir -p "$DEST"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
BASE="https://static.wixstatic.com/media"

# name|wix-media-filename
map=(
  # branding
  "logo-main|6f7ec1_373ab57f32cd47309dd8f17b13bc2b96~mv2.png"
  "top-banner|ea26fd_b98ad44cb7e04b4abd1a58f68251f9b9~mv2.png"
  # home
  "home-ai-circuit-wide|6f7ec1_0b3ec96462a2449ea8e5e1d82f1d48d3~mv2.jpg"
  "home-ai-circuit-tall|6f7ec1_347a878ba06d495db94a00b7b18917ee~mv2.jpg"
  "promo-current|6f7ec1_d64ec402a8dd4a67b4d1211581ad60ec~mv2.jpg"
  "home-feature-fitness|6f7ec1_67c088c6c79b45f6a5212653a9ce779c~mv2.jpg"
  "home-gx-icon|6f7ec1_93315331483248beb23b4d3b2a07df79~mv2.jpg"
  "home-kpa-icon|6f7ec1_e4df173498994d86808d72e45713bcb8~mv2.jpg"
  "home-academy-icon|6f7ec1_bc86130531ee44f3a95271db08a1b662~mv2.jpg"
  "home-wellness-hero|84770f_a9f7042c46864cf3ac62bbdae7ffbad5~mv2.jpg"
  "naver-booking-logo|6f7ec1_15b2d4f7503d469c977b3210bb6c50a5~mv2.png"
  # social icons
  "icon-kakao|6f7ec1_aa96ba9ba225435ab42f85fea20be33a~mv2.png"
  "icon-instagram|6f7ec1_76a4c4135d7b44e6857951589d8383a2~mv2.png"
  "icon-facebook|6f7ec1_36b8dc8e803d424692aafce15ef0e935~mv2.png"
  "icon-naver-blog|6f7ec1_72d51dd8069d45f58c3e20d57d832a81~mv2.png"
  "icon-naver-map|6f7ec1_9946421d5b414f39a0c0ca23d4bbad6a~mv2.png"
  # facilities
  "facility-health|6f7ec1_732afa698a9a42d0b323ec3288697c51~mv2.jpg"
  "facility-golf|6f7ec1_0455032c454e4d20b1f26d19e249fb59~mv2.jpg"
  "facility-swim|6f7ec1_dfb4c3e7baaf41759e0edcb3d75e593d~mv2.jpg"
  "facility-gx|6f7ec1_447d81b14a594df296e5b1e0d723d0a6~mv2.jpg"
  "facility-aicircuit|6f7ec1_7582796142ec4322b1a670773d96865c~mv2.jpg"
  "facility-pilates|6f7ec1_fa75302454fd4f9580f2389576ec533a~mv2.jpg"
  "facility-youth|6f7ec1_05372ada15864abc9ca0bdc901825904~mv2.jpg"
  "facility-sauna|6f7ec1_8b83f197098a4aeb9a164cdfcdbfc8f6~mv2.jpg"
  # about / brand
  "brand-story|6f7ec1_0301992c81d84844804c9cc29fd65de3~mv2.png"
  "brand-bally|6f7ec1_e781ea446c2a4ba797f57494871c4d79~mv2.png"
  "brand-pivot|6f7ec1_19221d3d788640228df7573d3e53eb6b~mv2.png"
  "brand-wellnesphilia|6f7ec1_53e32ffbbb464346bbc1c56b526eb3bc~mv2.png"
  # academy / brand pages
  "kpa-association|6f7ec1_de1873af2f9f48db913c94757f29809b~mv2.png"
  "bally-logo|6f7ec1_fc42e7993eed414ab4093e750855387e~mv2.png"
  "spiral-logo|6f7ec1_8ccec0e29440492db3057fa2b02bbe27~mv2.png"
  "challenge|6f7ec1_9315f88f5ef64a30a0fcd97aacde7a17~mv2.png"
  # schedule / swimming posters (monthly — replace each month)
  "schedule-operating|6f7ec1_ae337347292c4353b71e107a1eeb3797~mv2.jpg"
  "schedule-gx|6f7ec1_5ab0948d4586497d8995050c161b0e78~mv2.jpg"
  "swimming-notice|6f7ec1_4d19e4f305c94991947be32068548ca9~mv2.png"
  "swimming-schedule|6f7ec1_a50bff1f08e444ad832fc0e409607871~mv2.jpg"
  # academy division logos
  "academy-pivot|6f7ec1_19221d3d788640228df7573d3e53eb6b~mv2.png"
  "academy-kpa|6f7ec1_de1873af2f9f48db913c94757f29809b~mv2.png"
  "academy-sfm|6f7ec1_15af58fae75543849580a362cfc7328e~mv2.png"
  "academy-spiral|6f7ec1_8ccec0e29440492db3057fa2b02bbe27~mv2.png"
  "academy-kcpt|6f7ec1_9a33f9939f7045e897c6e10a7725e7ef~mv2.png"
  "academy-bally|6f7ec1_fc42e7993eed414ab4093e750855387e~mv2.png"
  "academy-pilatesinphillip|6f7ec1_390b601f65b24a0c917929dc46886400~mv2.png"
)

ok=0; fail=0
for entry in "${map[@]}"; do
  name="${entry%%|*}"
  file="${entry##*|}"
  ext="${file##*.}"
  out="$DEST/${name}.${ext}"
  if curl -fsSL -A "$UA" "$BASE/$file" -o "$out" 2>/dev/null; then
    sz=$(wc -c < "$out" | tr -d ' ')
    echo "OK   $name.$ext ($sz bytes)"
    ok=$((ok+1))
  else
    echo "FAIL $name  <- $file"
    fail=$((fail+1))
    rm -f "$out"
  fi
done
echo "---"
echo "Downloaded: $ok  Failed: $fail"
