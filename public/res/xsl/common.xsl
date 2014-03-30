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
		<xsl:sort order="ascending" select="@index"/>
		<li data-track="parent" data-cmd="timeline -s make_track_active">
			<xsl:attribute name="data-track_row_id">track_<xsl:value-of select="position()"/></xsl:attribute>
			<div class="tl_layer" data-dblclick="timeline -s dblclick_layer">
				<figure class="icon-eye_on">&#160;</figure>
				<figure class="icon-arrow_down" data-cmd="timeline -s toggle_layer">&#160;</figure>
				<span class="layer_name"><xsl:value-of select="//file/assets/*[@id=current()/@asset_id]/@name"/></span>
			</div>

            <ul class="brushes">
				<xsl:for-each select="./brush">
				<li>
					<xsl:attribute name="data-brush_id">brush_<xsl:value-of select="count(../preceding-sibling::*)+1"/>-<xsl:value-of select="position()"/></xsl:attribute>
					<figure class="icon-trashcan right">&#160;</figure>
					<figure class="icon-add right">&#160;</figure>
					<span><xsl:value-of select="@name"/></span>
				</li>
				</xsl:for-each>
			</ul>

		</li>
	</xsl:for-each>
</xsl:template>

<xsl:template name="timeline_right">
	<xsl:for-each select=".//timeline/layer">
		<xsl:sort order="ascending" select="@index"/>
		<li data-track="parent" data-cmd="timeline -s make_track_active">
			<xsl:attribute name="data-track_id">track_<xsl:value-of select="position()"/></xsl:attribute>

			<div data-context="tl_track">
				<xsl:attribute name="class">anim_track <xsl:value-of select="@color"/></xsl:attribute>
				<xsl:attribute name="style">
					margin-left: <xsl:value-of select="@start * 16"/>px;
					width: <xsl:value-of select="(@length * 16)-1"/>px;
				</xsl:attribute>
				&#160;
			</div>

			<ul class="brush_tracks">
				<xsl:for-each select="./brush">
				<li>
					<div data-context="tl_track">
						<xsl:attribute name="class">anim_track <xsl:value-of select="@color"/></xsl:attribute>
						<xsl:attribute name="style">
							margin-left: <xsl:value-of select="(@start + ../@start)*16"/>px;
							width: <xsl:value-of select="(@length * 16)-1"/>px;
						</xsl:attribute>
						&#160;
					</div>
				</li>
				</xsl:for-each>
			</ul>

		</li>
	</xsl:for-each>
</xsl:template>

</xsl:stylesheet>

