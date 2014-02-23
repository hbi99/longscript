<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output indent="yes"/>
<xsl:strip-space elements="*"/>

<xsl:template name="menu">
	<div>
		<xsl:attribute name="class">context-menu
			<xsl:if test="./*[@hotkey]">hasHotkeys</xsl:if>
			<xsl:if test="@pointTo"><xsl:value-of select="@pointTo"/></xsl:if>
		</xsl:attribute><div class="cntnr">
		<xsl:for-each select="./*">
			<xsl:choose>
				<xsl:when test="@type='divider'"><div class="divider">&#160;</div></xsl:when>
				<xsl:otherwise>
					<div>
						<xsl:attribute name="data-id"><xsl:value-of select="@_id"/></xsl:attribute>
						<xsl:attribute name="class">LIVE menu-item
							<xsl:if test="count(./*) &gt; 0 or @invoke">hasSub</xsl:if>
							<xsl:if test="@isChecked = '1'">checked</xsl:if>
							<xsl:if test="@disabled">disabled</xsl:if>
						</xsl:attribute><xsl:value-of select="@name"/>
						<xsl:if test="@hotkey"><span><xsl:value-of select="@hotkey"/></span></xsl:if>
					</div>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
	</div></div>
</xsl:template>

</xsl:stylesheet>