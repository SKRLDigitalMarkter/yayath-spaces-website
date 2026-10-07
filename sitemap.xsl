<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:html="http://www.w3.org/TR/REC-html40" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<title>XML Sitemap | Yayath Spaces</title>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
				<style type="text/css">
					body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; color: #333; background: #f8fafc; padding: 30px; }
					.container { max-width: 900px; margin: 0 auto; background: #fff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
					h1 { color: #2a1060; font-size: 24px; margin-bottom: 8px; }
					p { color: #666; font-size: 14px; margin-bottom: 24px; }
					table { width: 100%; border-collapse: collapse; margin-top: 15px; }
					th { text-align: left; padding: 12px 16px; background: #2a1060; color: #fff; font-size: 13px; font-weight: 600; }
					td { padding: 12px 16px; border-bottom: 1px solid #edf2f7; font-size: 14px; word-break: break-all; }
					tr:hover { background: #f7fafc; }
					a { color: #c9933b; font-weight: 600; text-decoration: none; }
					a:hover { text-decoration: underline; }
				</style>
			</head>
			<body>
				<div class="container">
					<h1>XML Sitemap — Yayath Spaces</h1>
					<p>This is an XML Sitemap generated for search engines like Google, Bing, and DuckDuckGo.</p>
					<table>
						<tr>
							<th>URL</th>
							<th>Last Modified</th>
							<th>Change Frequency</th>
							<th>Priority</th>
						</tr>
						<xsl:for-each select="sitemap:urlset/sitemap:url">
							<tr>
								<td>
									<xsl:variable name="itemURL">
										<xsl:value-of select="sitemap:loc"/>
									</xsl:variable>
									<a href="{$itemURL}"><xsl:value-of select="sitemap:loc"/></a>
								</td>
								<td><xsl:value-of select="sitemap:lastmod"/></td>
								<td><xsl:value-of select="sitemap:changefreq"/></td>
								<td><xsl:value-of select="sitemap:priority"/></td>
							</tr>
						</xsl:for-each>
					</table>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
