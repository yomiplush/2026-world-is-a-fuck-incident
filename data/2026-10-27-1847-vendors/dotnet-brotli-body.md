## Executive summary

A buffer overflow vulnerability exists in the Brotli decompression library used by .NET. This vulnerability may allow an unauthenticated attacker to read or corrupt process memory. This could lead to information disclosure, denial of service, or elevation of privilege.

ASP.NET Core and HttpClient do not automatically decompress Brotli data in their default configurations. Applications are exposed when they enable Brotli decompression or explicitly use Brotli decompression APIs to process attacker-controlled data, as described below. .NET Framework is not affected.

## Discussion

Discussion for this issue can be found at https://github.com/dotnet/runtime/issues/136446

## CVSS Details

- **Version:** 3.1
- **Severity:** High
- **Score:** 8.1
- **Vector:** `CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H/E:U/RL:O/RC:C`
- **Weakness:** CWE-787 (Out-of-bounds Write)

## Affected Platforms

- **Platforms:** All
- **Architectures:** All

## Mitigations

ASP.NET Core request decompression and HttpClient automatic response decompression are not enabled by default. An application is not exposed merely because an affected .NET package is installed. Exposure requires the application to decompress attacker-controlled Brotli data through one of these paths:

- Enable ASP.NET Core [automatic request decompression](https://learn.microsoft.com/aspnet/core/fundamentals/middleware/request-decompression) with Brotli (`br`) support.
- Enable HttpClient automatic response decompression by configuring [HttpClientHandler.AutomaticDecompression](https://learn.microsoft.com/dotnet/api/system.net.http.httpclienthandler.automaticdecompression) or [SocketsHttpHandler.AutomaticDecompression](https://learn.microsoft.com/dotnet/api/system.net.http.socketshttphandler.automaticdecompression) to include [DecompressionMethods.Brotli](https://learn.microsoft.com/dotnet/api/system.net.decompressionmethods) or `DecompressionMethods.All`.
- Explicitly use Brotli decompression APIs in `System.IO.Compression`, such as `BrotliStream` or `BrotliDecoder`.

Until the update can be deployed, avoid decompressing attacker-controlled Brotli data.

The following examples show how to disable Brotli decompression if you are already using it.

> **Warning: Do not use these code snippets if you are not already using decompression.** Do not introduce a call to `AddRequestDecompression` if your application does not already call it. Similarly, do not introduce an `AutomaticDecompression` property assignment if your application does not already set that property. Modify only your existing decompression configuration. Enabling automatic decompression can introduce denial-of-service risks even when Brotli is excluded.

If you are already using Brotli request decompression in ASP.NET Core, exclude it by removing the `br` entry from your existing decompression configuration. This retains the default gzip and deflate providers:

```csharp
builder.Services.AddRequestDecompression(options =>
{
    options.DecompressionProviders.Remove("br");
});
```

If your application already enables HttpClient automatic response decompression, disable Brotli by updating the flags on your existing handler so they do not include `DecompressionMethods.Brotli`:

```csharp
var handler = new HttpClientHandler
{
    AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate
};

var httpClient = new HttpClient(handler);
```

Applications that directly use Brotli decompression APIs must stop passing untrusted Brotli data to those APIs until updated. Ensure that other application code does not continue to decompress the same untrusted Brotli data. These changes can affect normal request and response handling and should be tested before deployment. Installing the security update remains the recommended fix.

## <a name="affected-packages"></a>Affected Packages

The vulnerability affects .NET applications using an affected Brotli decoder in the runtime or NativeAOT packages listed below.

### .NET 8

Package name | Affected version | Patched version
------------ | ---------------- | ---------------
[Microsoft.DotNet.ILCompiler](https://www.nuget.org/packages/Microsoft.DotNet.ILCompiler) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.NativeAOT.ios-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.ios-arm64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.NativeAOT.iossimulator-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.iossimulator-arm64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.NativeAOT.iossimulator-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.iossimulator-x64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-arm64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-x64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.NativeAOT.maccatalyst-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.maccatalyst-arm64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.NativeAOT.maccatalyst-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.maccatalyst-x64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.NativeAOT.osx-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.osx-arm64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.NativeAOT.osx-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.osx-x64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.NativeAOT.tvos-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.tvos-arm64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.NativeAOT.tvossimulator-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.tvossimulator-arm64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.NativeAOT.tvossimulator-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.tvossimulator-x64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.LLVM.linux-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.LLVM.linux-arm64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.LLVM.linux-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.LLVM.linux-x64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.LLVM.osx-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.LLVM.osx-x64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.android-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.android-arm) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.android-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.android-arm64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.android-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.android-x64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.android-x86](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.android-x86) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.browser-wasm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.browser-wasm) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.ios-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.ios-arm64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.iossimulator-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.iossimulator-arm64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.iossimulator-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.iossimulator-x64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.linux-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.linux-arm) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.linux-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.linux-arm64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.linux-musl-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.linux-musl-x64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.linux-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.linux-x64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.maccatalyst-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.maccatalyst-arm64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.maccatalyst-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.maccatalyst-x64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.multithread.browser-wasm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.multithread.browser-wasm) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.osx-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.osx-arm64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.osx-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.osx-x64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.tvos-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.tvos-arm64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.tvossimulator-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.tvossimulator-arm64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.tvossimulator-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.tvossimulator-x64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.wasi-wasm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.wasi-wasm) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.win-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.win-x64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.Mono.win-x86](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.win-x86) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.linux-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-arm) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.linux-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-arm64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.linux-bionic-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-bionic-arm64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.linux-bionic-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-bionic-x64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.linux-musl-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-musl-arm) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.linux-musl-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-musl-arm64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.linux-musl-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-musl-x64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.linux-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-x64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.osx-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.osx-arm64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.osx-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.osx-x64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.win-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.win-arm64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.win-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.win-x64) | >= 8.0.0, < 8.0.33 | 8.0.33
[Microsoft.NETCore.App.Runtime.win-x86](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.win-x86) | >= 8.0.0, < 8.0.33 | 8.0.33

### .NET 9

Package name | Affected version | Patched version
------------ | ---------------- | ---------------
[Microsoft.DotNet.ILCompiler](https://www.nuget.org/packages/Microsoft.DotNet.ILCompiler) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.NativeAOT.ios-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.ios-arm64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.NativeAOT.iossimulator-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.iossimulator-arm64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.NativeAOT.iossimulator-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.iossimulator-x64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-arm) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-arm64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-arm) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-arm64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-x64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-musl-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-musl-arm) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-musl-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-musl-arm64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-musl-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-musl-x64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-x64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.NativeAOT.maccatalyst-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.maccatalyst-arm64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.NativeAOT.maccatalyst-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.maccatalyst-x64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.NativeAOT.osx-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.osx-arm64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.NativeAOT.osx-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.osx-x64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.NativeAOT.tvos-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.tvos-arm64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.NativeAOT.tvossimulator-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.tvossimulator-arm64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.NativeAOT.tvossimulator-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.tvossimulator-x64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.NativeAOT.win-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.win-arm64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.NativeAOT.win-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.win-x64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.NativeAOT.win-x86](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.win-x86) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.Mono.android-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.android-arm) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.Mono.android-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.android-arm64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.Mono.android-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.android-x64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.Mono.android-x86](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.android-x86) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.Mono.browser-wasm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.browser-wasm) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.Mono.ios-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.ios-arm64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.Mono.iossimulator-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.iossimulator-arm64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.Mono.iossimulator-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.iossimulator-x64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.Mono.maccatalyst-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.maccatalyst-arm64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.Mono.maccatalyst-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.maccatalyst-x64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.Mono.multithread.browser-wasm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.multithread.browser-wasm) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.Mono.tvos-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.tvos-arm64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.Mono.tvossimulator-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.tvossimulator-arm64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.Mono.tvossimulator-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.tvossimulator-x64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.Mono.wasi-wasm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.wasi-wasm) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.linux-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-arm) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.linux-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-arm64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.linux-bionic-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-bionic-arm64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.linux-bionic-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-bionic-x64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.linux-musl-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-musl-arm) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.linux-musl-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-musl-arm64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.linux-musl-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-musl-x64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.linux-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-x64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.osx-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.osx-arm64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.osx-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.osx-x64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.win-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.win-arm64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.win-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.win-x64) | >= 9.0.0, < 9.0.22 | 9.0.22
[Microsoft.NETCore.App.Runtime.win-x86](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.win-x86) | >= 9.0.0, < 9.0.22 | 9.0.22

### .NET 10

Package name | Affected version | Patched version
------------ | ---------------- | ---------------
[Microsoft.DotNet.ILCompiler](https://www.nuget.org/packages/Microsoft.DotNet.ILCompiler) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.android-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.android-arm) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.android-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.android-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.android-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.android-x64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.ios-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.ios-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.iossimulator-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.iossimulator-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.iossimulator-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.iossimulator-x64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-arm) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-arm) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-x64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-musl-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-musl-arm) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-musl-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-musl-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-musl-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-musl-x64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-x64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.maccatalyst-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.maccatalyst-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.maccatalyst-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.maccatalyst-x64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.osx-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.osx-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.osx-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.osx-x64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.tvos-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.tvos-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.tvossimulator-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.tvossimulator-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.tvossimulator-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.tvossimulator-x64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.win-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.win-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.win-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.win-x64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.NativeAOT.win-x86](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.win-x86) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.Mono.android-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.android-arm) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.Mono.android-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.android-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.Mono.android-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.android-x64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.Mono.android-x86](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.android-x86) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.Mono.browser-wasm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.browser-wasm) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.Mono.ios-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.ios-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.Mono.iossimulator-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.iossimulator-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.Mono.iossimulator-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.iossimulator-x64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.Mono.maccatalyst-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.maccatalyst-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.Mono.maccatalyst-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.maccatalyst-x64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.Mono.multithread.browser-wasm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.multithread.browser-wasm) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.Mono.tvos-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.tvos-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.Mono.tvossimulator-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.tvossimulator-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.Mono.tvossimulator-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.tvossimulator-x64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.Mono.wasi-wasm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.wasi-wasm) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.android-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.android-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.android-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.android-x64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.linux-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-arm) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.linux-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.linux-bionic-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-bionic-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.linux-bionic-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-bionic-x64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.linux-musl-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-musl-arm) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.linux-musl-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-musl-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.linux-musl-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-musl-x64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.linux-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-x64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.osx-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.osx-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.osx-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.osx-x64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.win-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.win-arm64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.win-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.win-x64) | >= 10.0.0, < 10.0.14 | 10.0.14
[Microsoft.NETCore.App.Runtime.win-x86](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.win-x86) | >= 10.0.0, < 10.0.14 | 10.0.14

### .NET 11 previews

Package name | Affected version | Patched version
------------ | ---------------- | ---------------
[Microsoft.DotNet.ILCompiler](https://www.nuget.org/packages/Microsoft.DotNet.ILCompiler) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.android-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.android-arm) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.android-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.android-arm64) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.android-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.android-x64) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.ios-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.ios-arm64) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.iossimulator-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.iossimulator-arm64) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.iossimulator-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.iossimulator-x64) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-arm) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-arm64) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-arm) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-arm64) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-bionic-x64) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-musl-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-musl-arm) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-musl-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-musl-arm64) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-musl-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-musl-x64) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.linux-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.linux-x64) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.maccatalyst-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.maccatalyst-arm64) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.maccatalyst-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.maccatalyst-x64) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.osx-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.osx-arm64) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.osx-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.osx-x64) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.tvos-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.tvos-arm64) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.tvossimulator-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.tvossimulator-arm64) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.tvossimulator-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.tvossimulator-x64) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.win-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.win-arm64) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.win-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.win-x64) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.NativeAOT.win-x86](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.NativeAOT.win-x86) | >= 11.0.0-preview.1.26104.118, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.Mono.android-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.android-arm) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.Mono.android-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.android-arm64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.Mono.android-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.android-x64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.Mono.android-x86](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.android-x86) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.Mono.browser-wasm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.browser-wasm) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.Mono.ios-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.ios-arm64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.Mono.iossimulator-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.iossimulator-arm64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.Mono.iossimulator-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.iossimulator-x64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.Mono.maccatalyst-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.maccatalyst-arm64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.Mono.maccatalyst-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.maccatalyst-x64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.Mono.multithread.browser-wasm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.multithread.browser-wasm) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.Mono.tvos-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.tvos-arm64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.Mono.tvossimulator-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.tvossimulator-arm64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.Mono.tvossimulator-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.tvossimulator-x64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.Mono.wasi-wasm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.Mono.wasi-wasm) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.android-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.android-arm) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.android-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.android-arm64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.android-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.android-x64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.browser-wasm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.browser-wasm) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.ios-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.ios-arm64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.iossimulator-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.iossimulator-arm64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.iossimulator-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.iossimulator-x64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.linux-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-arm) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.linux-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-arm64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.linux-bionic-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-bionic-arm64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.linux-bionic-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-bionic-x64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.linux-musl-arm](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-musl-arm) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.linux-musl-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-musl-arm64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.linux-musl-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-musl-x64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.linux-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.linux-x64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.maccatalyst-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.maccatalyst-arm64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.maccatalyst-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.maccatalyst-x64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.osx-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.osx-arm64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.osx-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.osx-x64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.tvos-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.tvos-arm64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.tvossimulator-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.tvossimulator-arm64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.tvossimulator-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.tvossimulator-x64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.win-arm64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.win-arm64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.win-x64](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.win-x64) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148
[Microsoft.NETCore.App.Runtime.win-x86](https://www.nuget.org/packages/Microsoft.NETCore.App.Runtime.win-x86) | >= 11.0.0-preview.1, < 11.0.0-rc.3.26522.148 | 11.0.0-rc.3.26522.148

## Advisory FAQ

### <a name="how-affected"></a>How do I know if I am affected?

You are affected if your application uses an affected Brotli decoder included in a package listed in [affected packages](#affected-packages), including a decoder linked into a NativeAOT application, to decompress attacker-controlled data. See [mitigations](#mitigations) for the affected usage paths and default settings.

### <a name="how-fix"></a>How do I fix the issue?

Install the updated runtime or SDK for the .NET version used by your application. If your application directly references an affected package, update that reference to the patched version listed above.

.NET release | Runtime | SDK versions
------------ | ------- | ------------
.NET 8 | 8.0.33 | 8.0.133, 8.0.427
.NET 9 | 9.0.22 | 9.0.123, 9.0.320
.NET 10 | 10.0.14 | 10.0.114, 10.0.403
.NET 11 previews | 11.0.0-rc.3.26522.148 | 11.0.100-rc.3.26522.148

Download .NET from https://dotnet.microsoft.com/download/dotnet.

* If you're using .NET 8.0, you should download and install .NET 8.0.33 Runtime or .NET 8.0.133 or 8.0.427 SDK from https://dotnet.microsoft.com/download/dotnet-core/8.0.
* If you're using .NET 9.0, you should download and install .NET 9.0.22 Runtime or .NET 9.0.123 or 9.0.320 SDK from https://dotnet.microsoft.com/download/dotnet-core/9.0.
* If you're using .NET 10.0, you should download and install .NET 10.0.14 Runtime or .NET 10.0.114 or 10.0.403 SDK from https://dotnet.microsoft.com/download/dotnet-core/10.0.
* If you're using .NET 11.0, you should download and install .NET 11.0.0-rc.3.26522.148 Runtime or .NET 11.0.100-rc.3.26522.148 SDK from https://dotnet.microsoft.com/download/dotnet-core/11.0.

Once you have installed the updated runtime or SDK, restart your apps for the update to take effect.

If you have deployed [self-contained applications](https://learn.microsoft.com/dotnet/core/deploying/#self-contained-deployments), rebuild and redeploy those applications with the updated runtime.

For NativeAOT applications, update the SDK and any explicit compiler or runtime-pack references to patched versions, then republish and redeploy the application. Updating the machine's shared runtime alone does not replace a decoder already linked into a NativeAOT executable.

## Other Information

### Reporting Security Issues

If you have found a potential security issue in a supported version of .NET, please report it to the Microsoft Security Response Center (MSRC) via the [MSRC Researcher Portal](https://msrc.microsoft.com/report/vulnerability/new). Further information can be found in the MSRC [Report an Issue FAQ](https://www.microsoft.com/msrc/faqs-report-an-issue).

Security reports made through MSRC may qualify for the Microsoft .NET Bounty. Details of the Microsoft .NET Bounty Program including terms and conditions are at https://aka.ms/corebounty.

### Support

You can ask questions about this issue on GitHub in the .NET GitHub organization. The main repos are located at https://github.com/dotnet/runtime. The Announcements repo (https://github.com/dotnet/Announcements) will contain this bulletin as an issue and will include a link to a discussion issue. You can ask questions in the linked discussion issue.

### Disclaimer

The information provided in this advisory is provided "as is" without warranty of any kind. Microsoft disclaims all warranties, either express or implied, including the warranties of merchantability and fitness for a particular purpose. In no event shall Microsoft Corporation or its suppliers be liable for any damages whatsoever including direct, indirect, incidental, consequential, loss of business profits or special damages, even if Microsoft Corporation or its suppliers have been advised of the possibility of such damages. Some states do not allow the exclusion or limitation of liability for consequential or incidental damages so the foregoing limitation may not apply.

### External Links

[CVE-2026-111497](https://www.cve.org/CVERecord?id=CVE-2026-111497)

### Revisions

V1.0 (10/25/2026): Initial advisory.


<!-- release-day-publish:CVE-2026-111497:announcement -->
