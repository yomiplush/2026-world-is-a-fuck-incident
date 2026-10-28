# Device compatibility and runtime performance

The user requests a site-wide refactor that reduces processing and works on more
devices. Continue the existing free-only constraint. Preserve the current content,
65 stable scene links, five complete motion translations, reading pages, native
controls, consent, gesture-gated audio, reduced motion and adaptive frame budgets.

## Approach

Keep the static site and its existing module interfaces. A framework rewrite adds
download and migration work without addressing the measured rendering seam.
Instead, optimize delivery and the shared Canvas engine used by every scene.

1. Build a small deferred entry bundle and a separate, gesture-loaded motion
   bundle using pinned esbuild as a development-only dependency. Minify and
   transform modern syntax to ES2015. Keep editable source modules and generated
   bundles checked in. Hash generated filenames so HTML and the motion loader
   always agree. Combine the entry styles without changing stylesheet order.
2. Provide conservative feature handling: support legacy MediaQueryList
   listeners; Web Audio failures must never prevent reading/navigation; absent
   Canvas or essential JavaScript features lead to the existing complete JA/EN
   transcript. Keep an accessible no-JavaScript reading route.
3. Remove allocation-only intermediates in projection/depth and stream label
   placement candidates. Preserve painter order, the nearest valid placement,
   source text and geometry. Verify complete Canvas command traces against the
   pre-refactor source before relying on timing improvements.
4. Coalesce visible-viewport events into one update per frame and avoid style
   writes and layout events when the rounded dimensions did not change. Native
   pinch zoom remains untouched.
5. Use smaller SFX reverb buffers and fewer simultaneous voices on devices that
   report low memory, low CPU capacity or Save-Data. Keep music streamed and
   gesture-gated. Normal devices retain the original audio settings.

## Compatibility contract

ES2015 output is a syntax target, not a guarantee for every browser. Optional
browser APIs are guarded. Essential feature checks avoid a broken animated
entrance and offer the static transcript. Test legacy media listeners, unavailable
audio, missing Canvas, reduced motion, denied storage, low capacity, small and
large viewports. Chromium emulation does not certify physical Safari, Quest or TV
hardware; document that limit instead of claiming universal support.

## Measurement and acceptance

Record pre/post source and compressed asset sizes and request counts. Compare
65 scenes across representative times, viewports and camera angles by Canvas
command digest. Benchmark shared engine JavaScript separately from browser raster
cost. Existing adaptive render tests must continue bounding frame rate, pixels
and callbacks; hidden and settled views must have no recurring jobs. Browser QA
must retain all325 language/scene checks, entry retries, consent, touch/keyboard,
dynamic viewport and readable native controls. Run the reading-page builders and
the asset builder in a documented order. Review, commit, push and deploy the
verified static artifacts to the existing Cloudflare Pages project, then verify
the public URL. No paid API, tracking, external fonts or browser runtime dependency.
