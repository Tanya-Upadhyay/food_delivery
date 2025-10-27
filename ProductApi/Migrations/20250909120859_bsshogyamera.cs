using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProductApi.Migrations
{
    /// <inheritdoc />
    public partial class bsshogyamera : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UID",
                table: "Address");

            migrationBuilder.AddColumn<int>(
                name: "AID",
                table: "Order",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AID",
                table: "Order");

            migrationBuilder.AddColumn<int>(
                name: "UID",
                table: "Address",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
