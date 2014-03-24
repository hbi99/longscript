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
							<xsl:if test="@checked = '1'">checked</xsl:if>
							<xsl:if test="@disabled">disabled</xsl:if>
						</xsl:attribute><xsl:value-of select="@name"/>
						<xsl:if test="@hotkey"><span><xsl:value-of select="@hotkey"/></span></xsl:if>
					</div>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
	</div></div>
</xsl:template>

<xsl:template name="assets">
	<xsl:for-each select=".//assets/*">
		<li>
			<figure>
				<xsl:attribute name="style">background-image: url(<xsl:value-of select="@source"/>);</xsl:attribute>
			&#160;</figure>
			<span><xsl:value-of select="@name"/></span>
		</li>
	</xsl:for-each>
</xsl:template>

<xsl:template name="timeline_left">
	<xsl:for-each select=".//timeline/layer">
		<li>
			<figure class="icon-eye_on">&#160;</figure>
			<figure class="icon-trashcan right">&#160;</figure>
			<figure class="icon-add right">&#160;</figure>
			<span class="layer_name"><xsl:value-of select="//file/assets/*[@id=current()/@asset_id]/@name"/></span>
		</li>
		<xsl:call-template name="timeline_left_brushes"/>
	</xsl:for-each>
</xsl:template>

<xsl:template name="timeline_left_brushes">
	<xsl:for-each select="./brush">
		<li class="brush">
			<figure class="icon-eye_on">&#160;</figure>
			<figure class="icon-trashcan right">&#160;</figure>
			<figure class="icon-add right">&#160;</figure>
			<span class="brush_name"><xsl:value-of select="@name"/></span>
		</li>
	</xsl:for-each>
</xsl:template>


<xsl:template name="timeline_right">
	<xsl:for-each select=".//timeline/layer">
		<li><div class="anim_track teal">&#160;</div></li>
	</xsl:for-each>
</xsl:template>

</xsl:stylesheet>

